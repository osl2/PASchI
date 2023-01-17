package edu.kit.informatik.service;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.courses.SeatArrangementDto;
import edu.kit.informatik.model.userdata.courses.SeatArrangement;
import edu.kit.informatik.repositories.SeatArrangementRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service für {@link SeatArrangement Sitzordnungen}.
 *
 * @author ugqbo
 * @version 1.0
 */

@Service
public class SeatArrangementService extends BaseService<SeatArrangement, SeatArrangementDto> {

    private final SeatArrangementRepository seatArrangementRepository;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     * @param seatArrangementRepository {@link SeatArrangementRepository}
     */
    public SeatArrangementService(SeatArrangementRepository seatArrangementRepository,
                                  IModelDtoMapper<SeatArrangement, SeatArrangementDto> mapper) {
        super(mapper);
        this.seatArrangementRepository = seatArrangementRepository;
    }

    @Override
    public SeatArrangementDto add(SeatArrangementDto seatArrangementDto) {
        return null;
    }

    @Override
    public SeatArrangementDto update(SeatArrangementDto seatArrangementDto) {
        return null;
    }

    @Override
    public SeatArrangementDto getById(long id) {
        return null;
    }

    @Override
    public List<SeatArrangementDto> getAll() {
        return null;
    }

    @Override
    public long delete(long id) {
        return 0;
    }
}
