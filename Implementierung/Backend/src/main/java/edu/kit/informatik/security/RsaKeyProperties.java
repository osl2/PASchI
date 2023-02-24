package edu.kit.informatik.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

/**
 * Record für Public- und Private-Key
 * @param publicKey {@link RSAPublicKey}
 * @param privateKey {@link RSAPrivateKey}
 *
 * @author ugqbo
 * @version 1.0
 */
@ConfigurationProperties(prefix = "rsa")
public record RsaKeyProperties(RSAPublicKey publicKey, RSAPrivateKey privateKey) {


}
