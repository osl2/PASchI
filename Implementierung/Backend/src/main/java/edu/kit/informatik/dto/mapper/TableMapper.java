package edu.kit.informatik.dto.mapper;

import edu.kit.informatik.dto.userdata.rooms.TableDto;
import edu.kit.informatik.model.userdata.rooms.Table;

import java.util.List;

public class TableMapper implements IModelDtoMapper<Table, TableDto> {

    @Override
    public TableDto modelToDto(Table table) {
        return null;
    }

    @Override
    public List<TableDto> modelToDto(List<Table> tables) {
        return null;
    }

    @Override
    public Table dtoToModel(TableDto tableDto) {
        return null;
    }

    @Override
    public List<Table> dtoToModel(List<TableDto> tableDtos) {
        return null;
    }
}
