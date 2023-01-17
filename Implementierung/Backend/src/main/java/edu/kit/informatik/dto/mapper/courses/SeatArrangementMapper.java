package edu.kit.informatik.dto.mapper.courses;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.courses.SeatArrangementDto;
import edu.kit.informatik.model.userdata.courses.SeatArrangement;
import edu.kit.informatik.repositories.SeatArrangementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@Service
public class SeatArrangementMapper implements IModelDtoMapper<SeatArrangement, SeatArrangementDto> {

    private final SeatArrangementRepository seatArrangementRepository;

    @Autowired
    public SeatArrangementMapper(SeatArrangementRepository seatArrangementRepository) {
        this.seatArrangementRepository = seatArrangementRepository;
    }

    @Override
    public SeatArrangementDto modelToDto(SeatArrangement seatArrangement) {
        Map<Long, Long> seatMap = new HashMap<>();
        seatArrangement.getSeatMap().forEach((key, value) -> seatMap.put(key.getId(), value.getId()));

        return new SeatArrangementDto(
                seatArrangement.getId(),
                seatArrangement.getUser().getId(),
                seatArrangement.getName(),
                seatMap,
                seatArrangement.getRoom().getId(),
                seatArrangement.getCourse().getId()
        );
    }

    @Override
    public List<SeatArrangementDto> modelToDto(List<SeatArrangement> seatArrangements) {
        List<SeatArrangementDto> seatArrangementDtos = new LinkedList<>();
        seatArrangements.forEach(seatArrangement -> seatArrangementDtos.add(modelToDto(seatArrangement)));

        return seatArrangementDtos;
    }

    @Override
    public SeatArrangement dtoToModel(SeatArrangementDto seatArrangementDto) {
        // repository fehlt noch
        return null;
    }

    @Override
    public List<SeatArrangement> dtoToModel(List<SeatArrangementDto> seatArrangementDtos) {
        List<SeatArrangement> seatArrangements = new LinkedList<>();
        seatArrangementDtos.forEach(seatArrangementDto -> seatArrangements.add(dtoToModel(seatArrangementDto)));

        return seatArrangements;
    }
}
