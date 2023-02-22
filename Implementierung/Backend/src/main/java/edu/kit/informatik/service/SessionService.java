package edu.kit.informatik.service;


import edu.kit.informatik.dto.mapper.courses.SessionMapper;
import edu.kit.informatik.dto.userdata.courses.SessionDto;
import edu.kit.informatik.exceptions.EntityNotFoundException;
import edu.kit.informatik.model.userdata.courses.Session;
import edu.kit.informatik.model.userdata.interactions.Interaction;
import edu.kit.informatik.repositories.InteractionRepository;
import edu.kit.informatik.repositories.SessionRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Service für {@link Session Sitzungen}
 *
 * @author ugqbo
 * @version 1.0
 */

@Component
public class SessionService extends BaseService<Session, SessionDto, SessionDto> {

    private static final String ID_ATTRIBUTE = "userId";

    private final SessionRepository sessionRepository;
    private final InteractionRepository interactionRepository;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     *
     * @param sessionRepository     {@link SessionRepository}
     * @param sessionMapper         {@link SessionMapper}
     * @param interactionRepository {@link InteractionRepository}
     */
    public SessionService(SessionRepository sessionRepository, SessionMapper sessionMapper,
                          InteractionRepository interactionRepository) {
        super(sessionMapper);
        this.sessionRepository = sessionRepository;
        this.interactionRepository = interactionRepository;
    }

    @Override
    public SessionDto add(SessionDto sessionDto, Authentication authentication) {
        super.checkAuthorization(authentication, sessionDto.getUserId());
        Session session = this.mapper.dtoToModel(sessionDto);
        Session newSession = sessionRepository.save(session);

        return this.mapper.modelToDto(newSession);
    }

    @Transactional
    @Override
    public SessionDto update(SessionDto sessionDto, Authentication authentication) {
        super.checkAuthorization(authentication, sessionDto.getUserId());
        Optional<Session> repositorySessionOptional = sessionRepository.findSessionById(sessionDto.getId());

        Session repositorySession = repositorySessionOptional.orElseThrow(() -> new EntityNotFoundException(
                                                                                    Session.class, sessionDto.getId()));
        //System.out.println(sessionDto.getInteractions().get(0).getId());
        //System.out.println(sessionDto.getInteractions().get(1).getId());
        Session newSession = this.mapper.dtoToModel(sessionDto);
        //System.out.println(newSession.getInteractions().get(0).getId());
        //System.out.println(newSession.getInteractions().get(1).getId());

        if (!newSession.getInteractions().equals(repositorySession.getInteractions())) {
            //System.out.println(repositorySession.getInteractions().size());
           // System.out.println(newSession.getInteractions().size());


            //interactions.replaceAll(interactionRepository::save);
            //System.out.println(interactions.get(0).getId());
            repositorySession.setInteractions(updateInteractions(repositorySession, newSession));
            //System.out.println(repositorySession.getInteractions().size());

        } else if (!newSession.getSeatArrangement().equals(repositorySession.getSeatArrangement())) {
            repositorySession.setSeatArrangement(repositorySession.getSeatArrangement());
        } else if (!newSession.getName().equals(repositorySession.getName())) {
            repositorySession.setName(repositorySession.getName());
        }

        return mapper.modelToDto(repositorySession);
    }

    @Override
    public SessionDto getById(String id, Authentication authentication) {
        super.checkAuthorization(authentication, id);
        Optional<Session> sessionOptional = sessionRepository.findSessionById(id);

        return sessionOptional.map(this.mapper::modelToDto).orElseThrow(() -> new EntityNotFoundException(
                Session.class, id));
    }

    @Override
    public List<SessionDto> getAll(Authentication authentication) {
        JwtAuthenticationToken jAT = (JwtAuthenticationToken) authentication;

        return mapper.modelToDto(sessionRepository.findSessionsByUserId(
                                                                jAT.getTokenAttributes().get(ID_ATTRIBUTE).toString()));
    }

    @Override
    public String delete(String id, Authentication authentication) {
        super.checkAuthorization(authentication, id);
        Optional<Session> sessionOptional = sessionRepository.findById(id);
        if (sessionOptional.isEmpty()) {
            throw new EntityNotFoundException(Session.class, id);
        }

        this.sessionRepository.deleteById(id);

        return id;
    }

    private List<Interaction> updateInteractions(Session repositorySession , Session newSession) {
        List<Interaction> returnInteractions = new ArrayList<>();

        for (Interaction newInteraction: newSession.getInteractions()) {
            boolean found = false;
            for (Interaction repositoryInteraction: repositorySession.getInteractions()) {
                //System.out.println("ID1 : " + newInteraction.getId());
                //System.out.println("ID2 : " + repositoryInteraction.getId());
                if (newInteraction.getId() != null && newInteraction.getId().equals(repositoryInteraction.getId())) {
                    returnInteractions.add(repositoryInteraction);
                    found = true;
                    break;
                }
            }
            if (!found) {
                returnInteractions.add(interactionRepository.save(newInteraction));
            }
        }

        return returnInteractions;
    }
}
