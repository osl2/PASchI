package edu.kit.informatik.service;

import edu.kit.informatik.dto.mapper.courses.SeatArrangementMapper;
import edu.kit.informatik.dto.userdata.courses.SeatArrangementDto;
import edu.kit.informatik.exceptions.EntityNotFoundException;
import edu.kit.informatik.model.userdata.courses.Course;
import edu.kit.informatik.model.userdata.courses.SeatArrangement;
import edu.kit.informatik.repositories.CourseRepository;
import edu.kit.informatik.repositories.SeatArrangementRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

/**
 * Service für {@link SeatArrangement Sitzordnungen}.
 *
 * @author ugqbo
 * @version 1.0
 */

@Component
public class SeatArrangementService extends BaseService<SeatArrangement, SeatArrangementDto, SeatArrangementDto> {

    private static final String ID_ATTRIBUTE = "userId";

    private final SeatArrangementRepository seatArrangementRepository;
    private final CourseRepository courseRepository;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     *
     * @param seatArrangementRepository {@link SeatArrangementRepository}
     * @param seatArrangementMapper     {@link SeatArrangementMapper}
     * @param courseRepository          {@link CourseRepository}
     */
    public SeatArrangementService(SeatArrangementRepository seatArrangementRepository,
                                  SeatArrangementMapper seatArrangementMapper, CourseRepository courseRepository) {
        super(seatArrangementMapper);
        this.seatArrangementRepository = seatArrangementRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    public SeatArrangementDto add(SeatArrangementDto seatArrangementDto, Authentication authentication) {
        super.checkAuthorization(authentication, seatArrangementDto.getUserId());
        SeatArrangement seatArrangement = this.mapper.dtoToModel(seatArrangementDto);
        SeatArrangement newSeatArrangement = this.seatArrangementRepository.save(seatArrangement);
        return this.mapper.modelToDto(newSeatArrangement);
    }

    @Transactional
    @Override
    public SeatArrangementDto update(SeatArrangementDto seatArrangementDto, Authentication authentication) {
        super.checkAuthorization(authentication, seatArrangementDto.getUserId());
        Optional<SeatArrangement> repositorySeatArrangementOptional = this.seatArrangementRepository
                                                                .findSeatArrangementById(seatArrangementDto.getId());
        
        SeatArrangement repositorySeatArrangement = repositorySeatArrangementOptional.orElseThrow(
                        () -> new EntityNotFoundException(SeatArrangement.class, seatArrangementDto.getId()));
        SeatArrangement newSeatArrangement = this.mapper.dtoToModel(seatArrangementDto);

        if (!newSeatArrangement.getName().equals(repositorySeatArrangement.getName())) {
            repositorySeatArrangement.setName(newSeatArrangement.getName());
        }
        if (!newSeatArrangement.getSeatMap().equals(repositorySeatArrangement.getSeatMap())) {
            repositorySeatArrangement.setSeatMap(newSeatArrangement.getSeatMap());
        }
        
        return mapper.modelToDto(repositorySeatArrangement);
    }

    @Override
    public SeatArrangementDto getById(String id, Authentication authentication) {
        Optional<SeatArrangement> seatArrangementOptional = this.seatArrangementRepository.findSeatArrangementById(id);
        SeatArrangement seatArrangement = seatArrangementOptional.orElseThrow(() ->
                                                        new EntityNotFoundException(SeatArrangement.class, id));
        super.checkAuthorization(authentication, seatArrangement.getUser().getId());


        return this.mapper.modelToDto(seatArrangement);
    }

    @Override
    public List<SeatArrangementDto> getAll(Authentication authentication) {
        JwtAuthenticationToken jAT = (JwtAuthenticationToken) authentication;

        return mapper.modelToDto(this.seatArrangementRepository.findSeatArrangementsByUserId(
                                                                jAT.getTokenAttributes().get(ID_ATTRIBUTE).toString()));
    }

    @Override
    public String delete(String id, Authentication authentication) {
        Optional<SeatArrangement> seatArrangementOptional = this.seatArrangementRepository.findSeatArrangementById(id);
        SeatArrangement seatArrangement = seatArrangementOptional.orElseThrow(() ->
                                                            new EntityNotFoundException(SeatArrangement.class, id));
        super.checkAuthorization(authentication, seatArrangement.getUser().getId());

        return delete(seatArrangement);
    }

    /**
     * Methode zum Löschen einer {@link SeatArrangement}
     * @param seatArrangement {@link SeatArrangement}
     * @return Id des {@link SeatArrangement}
     */
    protected String delete(SeatArrangement seatArrangement) {
        Course course = courseRepository.findCourseBySeatArrangements(seatArrangement);
        if (course != null) {
            course.getSeatArrangements().remove(seatArrangement);
        }

        this.seatArrangementRepository.deleteById(seatArrangement.getId());

        return seatArrangement.getId();
    }
}
