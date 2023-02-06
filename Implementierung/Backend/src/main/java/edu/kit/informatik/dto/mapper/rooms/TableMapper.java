package edu.kit.informatik.dto.mapper.rooms;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.rooms.PositionDto;
import edu.kit.informatik.dto.userdata.rooms.TableDto;
import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.rooms.Position;
import edu.kit.informatik.model.userdata.rooms.Table;
import edu.kit.informatik.repositories.TableRepository;
import edu.kit.informatik.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


/**
 * {@link IModelDtoMapper} für {@link Table} and {@link TableDto}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@Service
public class TableMapper implements IModelDtoMapper<Table, TableDto> {

    private final TableRepository tableRepository;
    private final UserRepository userRepository;
    private final PositionMapper positionMapper;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     * @param tableRepository {@link TableRepository}
     * @param userRepository {@link UserRepository}
     * @param positionMapper {@link PositionMapper}
     */
    @Autowired
    public TableMapper(TableRepository tableRepository, UserRepository userRepository, PositionMapper positionMapper) {
        this.tableRepository = tableRepository;
        this.userRepository = userRepository;
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
        List<TableDto> tableDtos = new ArrayList<>();
        tables.forEach(table -> tableDtos.add(modelToDto(table)));

        return tableDtos;
    }

    @Override
    public Table dtoToModel(TableDto tableDto) {
        Table table = tableRepository.findTableById(tableDto.getId()).orElseGet(Table::new);
        User user = userRepository.findUserByEmail(tableDto.getUserId()).orElse(null);
        Position position = positionMapper.dtoToModel(tableDto.getPosition());

        table.setUser(user);
        table.setPosition(position);
        table.setLength(tableDto.getLength());
        table.setWidth(tableDto.getWidth());

        return table;
    }

    @Override
    public List<Table> dtoToModel(List<TableDto> tableDtos) {
        List<Table> tables = new ArrayList<>();
        tableDtos.forEach(tableDto -> tables.add(dtoToModel(tableDto)));

        return tables;
    }
}
