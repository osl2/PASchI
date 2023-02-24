package edu.kit.informatik.security;

import edu.kit.informatik.model.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.stream.Collectors;

/**
 * Service zum Erstellen eines {@link JwtAuthenticationToken JWT-Token} zum Authentifizieren mittels {@link JwtEncoder}
 *
 * @author ugqbo
 * @version 1.0
 */
@Service
public class TokenService {
    private final JwtEncoder jwtEncoder;

    /**
     * Konstruktor zum Erstellen eines Objektes
     * @param jwtEncoder {@link JwtEncoder}
     */
    public TokenService(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
    }

    /**
     * Methode zum Generieren eines {@link JwtAuthenticationToken} bei übergebener {@link Authentication}.
     * Die Gültigkeit des Tokens beträgt 30 Tage.
     * Beinhaltet {@link GrantedAuthority} (Claim: "scope") und die Id des {@link User} (Claim: "userId")
     *
     * @param authentication benötigte {@link Authentication}
     * @param user {@link User}
     * @return {@link JwtAuthenticationToken} als String
     */
    public String generateToken(Authentication authentication, User user) {

        Instant now = Instant.now();
        String scope = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(" "));
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plus(30, ChronoUnit.DAYS))
                .subject(authentication.getName())
                .claim("scope", scope)
                .claim("userId", user.getId())
                .build();
        return this.jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }
}
