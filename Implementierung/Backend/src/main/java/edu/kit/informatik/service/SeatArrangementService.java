package edu.kit.informatik.service;

import edu.kit.informatik.dto.mapper.courses.SeatArrangementMapper;
import edu.kit.informatik.dto.userdata.courses.SeatArrangementDto;
import edu.kit.informatik.exceptions.EntityNotFoundException;
import edu.kit.informatik.model.userdata.courses.SeatArrangement;
import edu.kit.informatik.repositories.SeatArrangementRepository;
import jakarta.transaction.Transactional;
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

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     * @param seatArrangementRepository {@link SeatArrangementRepository}
     * @param seatArrangementMapper {@link SeatArrangementMapper}
     */
    public SeatArrangementService(SeatArrangementRepository seatArrangementRepository,
                                  SeatArrangementMapper seatArrangementMapper) {
        super(seatArrangementMapper);
        this.seatArrangementRepository = seatArrangementRepository;
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
                        () -> new EntityNotFoundException(SeatArrangementService.class, seatArrangementDto.getId()));
        SeatArrangement newSeatArrangement = this.mapper.dtoToModel(seatArrangementDto);

        if (!newSeatArrangement.getName().equals(repositorySeatArrangement.getName())) {
            repositorySeatArrangement.setName(repositorySeatArrangement.getName());
        } else if (!newSeatArrangement.getSeatMap().equals(repositorySeatArrangement.getSeatMap())) {
            repositorySeatArrangement.setSeatMap(newSeatArrangement.getSeatMap());
        }
        
        return mapper.modelToDto(repositorySeatArrangement);
    }

    @Override
    public SeatArrangementDto getById(String id, Authentication authentication) {
        Optional<SeatArrangement> seatArrangementOptional = this.seatArrangementRepository.findSeatArrangementById(id);
        
        return seatArrangementOptional.map(this.mapper::modelToDto).orElseThrow(() ->
                                                                new EntityNotFoundException(SeatArrangement.class, id));
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

        seatArrangementOptional.orElseThrow(() -> new EntityNotFoundException(SeatArrangement.class, id));
        this.seatArrangementRepository.deleteById(id);
        
        return id;
    }
}
