package edu.kit.informatik.service;

import edu.kit.informatik.dto.courses.SeatArrangementDto;
import edu.kit.informatik.model.userdata.courses.SeatArrangement;
import edu.kit.informatik.repositories.SeatArrangementRepository;

import java.util.List;

/**
 * Service für {@link SeatArrangement Sitzordnungen}.
 *
 * @author ugqbo
 * @version 1.0
 */
public class SeatArrangementService implements BaseService<SeatArrangement, SeatArrangementDto> {

    private final SeatArrangementRepository seatArrangementRepository;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     * @param seatArrangementRepository {@link SeatArrangementRepository}
     */
    public SeatArrangementService(SeatArrangementRepository seatArrangementRepository) {
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
