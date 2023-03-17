package edu.kit.informatik.service;

import edu.kit.informatik.dto.mapper.courses.SessionMapper;
import edu.kit.informatik.dto.userdata.courses.SessionDto;
import edu.kit.informatik.exceptions.EntityNotFoundException;
import edu.kit.informatik.model.userdata.courses.Course;
import edu.kit.informatik.model.userdata.courses.Session;
import edu.kit.informatik.model.userdata.interactions.Interaction;
import edu.kit.informatik.model.userdata.interactions.Participant;
import edu.kit.informatik.repositories.CourseRepository;
import edu.kit.informatik.repositories.InteractionRepository;
import edu.kit.informatik.repositories.ParticipantRepository;
import edu.kit.informatik.repositories.SessionRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

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
    private final CourseRepository courseRepository;
    private final InteractionRepository interactionRepository;

    private final ParticipantRepository participantRepository;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     *
     * @param sessionRepository     {@link SessionRepository}
     * @param sessionMapper         {@link SessionMapper}
     * @param courseRepository      {@link CourseRepository}
     * @param interactionRepository {@link InteractionRepository}
     * @param participantRepository {@link ParticipantRepository}
     */
    public SessionService(SessionRepository sessionRepository, SessionMapper sessionMapper,
                          CourseRepository courseRepository, InteractionRepository interactionRepository,
                          ParticipantRepository participantRepository) {
        super(sessionMapper);
        this.sessionRepository = sessionRepository;
        this.courseRepository = courseRepository;
        this.interactionRepository = interactionRepository;
        this.participantRepository = participantRepository;
    }

    @Override
    public SessionDto add(SessionDto sessionDto, Authentication authentication) {
        super.checkAuthorization(authentication, sessionDto.getUserId());
        Session session = this.mapper.dtoToModel(sessionDto);
        Session newSession = sessionRepository.save(saveInteractions(session));

        return this.mapper.modelToDto(newSession);
    }

    @Transactional
    @Override
    public SessionDto update(SessionDto sessionDto, Authentication authentication) {
        super.checkAuthorization(authentication, sessionDto.getUserId());
        Optional<Session> repositorySessionOptional = sessionRepository.findSessionById(sessionDto.getId());

        Session repositorySession = repositorySessionOptional.orElseThrow(() -> new EntityNotFoundException(
                                                                                    Session.class, sessionDto.getId()));
        Session newSession = this.mapper.dtoToModel(sessionDto);

        if (!newSession.getInteractions().equals(repositorySession.getInteractions())) {
            repositorySession.setInteractions(updateInteractions(repositorySession, newSession));
        }
        if (!newSession.getSeatArrangement().equals(repositorySession.getSeatArrangement())) {
            repositorySession.setSeatArrangement(newSession.getSeatArrangement());
        }
        if (!newSession.getName().equals(repositorySession.getName())) {
            repositorySession.setName(newSession.getName());
        }

        return mapper.modelToDto(repositorySession);
    }

    @Override
    public SessionDto getById(String id, Authentication authentication) {
        Optional<Session> sessionOptional = sessionRepository.findSessionById(id);
        Session session = sessionOptional.orElseThrow(() -> new EntityNotFoundException(Session.class, id));

        super.checkAuthorization(authentication, session.getUser().getId());

        return this.mapper.modelToDto(session);
    }

    @Override
    public List<SessionDto> getAll(Authentication authentication) {
        JwtAuthenticationToken jAT = (JwtAuthenticationToken) authentication;

        return mapper.modelToDto(sessionRepository.findSessionsByUserId(
                                                                jAT.getTokenAttributes().get(ID_ATTRIBUTE).toString()));
    }

    @Transactional
    @Override
    public String delete(String id, Authentication authentication) {
        Optional<Session> sessionOptional = sessionRepository.findById(id);
        Session session = sessionOptional.orElseThrow(() -> new EntityNotFoundException(Session.class, id));

        super.checkAuthorization(authentication, session.getUser().getId());

        return delete(session);
    }

    /**
     * Methode zum Löschen einer {@link Session}
     * ->Löscht auch die {@link Interaction} aus den {@link Participant}
     * ->Löscht auch die {@link Session} aus dem {@link Course}
     * @param session {@link Session}
     * @return Id des {@link Session}
     */
    @Transactional
    protected String delete(Session session) {
        List<Interaction> interactions = interactionRepository.findInteractionsBySession(session);
        Set<Participant> participants = new HashSet<>();

        //Teilnehmer anhand der Interaktionen auslesen
        for (Interaction interaction : interactions) {
            participants.add(participantRepository.findParticipantById(interaction.getFrom().getId())
                    .orElseThrow(() -> new EntityNotFoundException(Participant.class, interaction.getFrom().getId())));
            participants.add(participantRepository.findParticipantById(interaction.getTo().getId())
                    .orElseThrow(() -> new EntityNotFoundException(Participant.class, interaction.getTo().getId())));
        }

        for (Participant participant: participants) {
            for (Interaction interaction: interactions) {
                participant.getInteractions().remove(interaction);
            }
        }

        for (Interaction interaction: interactions) {
            session.removeInteraction(interaction);
            interactionRepository.deleteById(interaction.getId());
        }

        Course course = courseRepository.findCourseBySessions(session);

        if (course != null) {
            course.getSessions().remove(session);
        }

        this.sessionRepository.deleteById(session.getId());

        return session.getId();
    }

    private List<Interaction> updateInteractions(Session repositorySession , Session newSession) {
        List<Interaction> returnInteractions = new ArrayList<>();

        for (Interaction newInteraction: newSession.getInteractions()) {
            boolean found = false;
            for (Interaction repositoryInteraction: repositorySession.getInteractions()) {
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

    private Session saveInteractions(Session session) {
        Session newSession = new Session(session.getUser(), session.getName(), session.getDate(), session.getCourse(),
                session.getSeatArrangement(), session.getCreatedAt(), session.getUpdatedAt());
        for (int i = 0; i < session.getInteractions().size(); i++) {
            newSession.addInteraction(interactionRepository.save(session.getInteractions().get(i)));
        }

        return newSession;
    }
}
