package edu.kit.informatik.dto.mapper.rooms;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.rooms.PositionDto;
import edu.kit.informatik.dto.userdata.rooms.TableDto;
import edu.kit.informatik.model.userdata.rooms.Table;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;

@Service
public class TableMapper implements IModelDtoMapper<Table, TableDto> {

    private final PositionMapper positionMapper;

    @Autowired
    public TableMapper(PositionMapper positionMapper) {
        this.positionMapper = positionMapper;
    }

    @Override
    public TableDto modelToDto(Table table) {
        PositionDto positionDto = positionMapper.modelToDto(table.getPosition());

        return new TableDto(
                table.getId(),
                table.getUser().getId(),
                positionDto,
                table.getLength(),
                table.getWidth()
        );
    }

    @Override
    public List<TableDto> modelToDto(List<Table> tables) {
        List<TableDto> tableDtos = new LinkedList<>();
        tables.forEach(table -> tableDtos.add(modelToDto(table)));

        return tableDtos;
    }

    @Override
    public Table dtoToModel(TableDto tableDto) {
        // repository fehlt noch
        return null;
    }

    @Override
    public List<Table> dtoToModel(List<TableDto> tableDtos) {
        List<Table> tables = new LinkedList<>();
        tableDtos.forEach(tableDto -> tables.add(dtoToModel(tableDto)));

        return tables;
    }
}