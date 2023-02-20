package edu.kit.informatik.dto.mapper.rooms;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.rooms.PositionDto;
import edu.kit.informatik.dto.userdata.rooms.TableDto;
import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.rooms.Position;
import edu.kit.informatik.model.userdata.rooms.Table;
import edu.kit.informatik.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
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
    private final UserRepository userRepository;
    private final PositionMapper positionMapper;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     *
     * @param userRepository  {@link UserRepository}
     * @param positionMapper  {@link PositionMapper}
     */
    @Autowired
    public TableMapper(UserRepository userRepository, PositionMapper positionMapper) {
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
                table.getWidth(),
                table.getCreatedAt(),
                table.getUpdatedAt()
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
        User user = userRepository.findUserByEmail(tableDto.getUserId()).orElse(null);
        Position position = positionMapper.dtoToModel(tableDto.getPosition());

        Timestamp updatedAt;

        if (tableDto.getUpdatedAt() == null) {
            updatedAt = tableDto.getCreatedAt();
        } else {
            updatedAt = tableDto.getUpdatedAt();
        }

        return new Table(user, position, tableDto.getLength(), tableDto.getWidth(),
                tableDto.getCreatedAt(), updatedAt);
    }

    @Override
    public List<Table> dtoToModel(List<TableDto> tableDtos) {
        List<Table> tables = new ArrayList<>();
        tableDtos.forEach(tableDto -> tables.add(dtoToModel(tableDto)));

        return tables;
    }
}
