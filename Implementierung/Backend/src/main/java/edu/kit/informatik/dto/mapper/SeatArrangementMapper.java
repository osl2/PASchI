package edu.kit.informatik.dto.mapper;

import edu.kit.informatik.dto.userdata.courses.SeatArrangementDto;
import edu.kit.informatik.model.userdata.courses.SeatArrangement;

import java.util.List;

public class SeatArrangementMapper implements IModelDtoMapper<SeatArrangement, SeatArrangementDto> {

    @Override
    public SeatArrangementDto modelToDto(SeatArrangement seatArrangement) {
        return null;
    }

    @Override
    public List<SeatArrangementDto> modelToDto(List<SeatArrangement> seatArrangements) {
        return null;
    }

    @Override
    public SeatArrangement dtoToModel(SeatArrangementDto seatArrangementDto) {
        return null;
    }

    @Override
    public List<SeatArrangement> dtoToModel(List<SeatArrangementDto> seatArrangementDtos) {
        return null;
    }
}