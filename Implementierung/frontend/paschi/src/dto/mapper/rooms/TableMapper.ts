import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {Table} from "@/model/userdata/rooms/Table";
import {TableDto} from "@/dto/userdata/rooms/TableDto";
import {PositionMapper} from "@/dto/mapper/rooms/PositionMapper";
import {UserController} from "@/controller/UserController";
import {useRoomObjectStore} from "@/store/RoomObjectStore";

export class TableMapper implements IModelDtoMapper<Table, TableDto> {

  private static mapper: TableMapper = new TableMapper();
  private positionMapper = PositionMapper.getMapper();

  private constructor() {
  }

  static getMapper(): TableMapper {
    return TableMapper.mapper;
  }

  modelToDto(table: Table): TableDto {
    return new TableDto(
      table.getId,
      table.user.getId,
      table.createdAt,
      table.updatedAt,
      this.positionMapper.modelToDto(table.position),
      table.dimensions.length,
      table.dimensions.width
    );
  }

  async dtoToModel(tableDto: TableDto): Promise<Table> {
    const userController = UserController.getUserController();

    const position = await this.positionMapper.dtoToModel(tableDto.position)

    let table = useRoomObjectStore().getTableByTimeCreatedAndPosition(tableDto.createdAt, position);
    if (table == undefined) {
      table = new Table(
        tableDto.id,
        0,
        userController.getUser(),
        position,
        tableDto.length,
        tableDto.width
      );
      table.updatedAt = tableDto.updatedAt;
      table.createdAt = tableDto.createdAt;
      useRoomObjectStore().addChair(table);
    }

    table.setId = tableDto.id;
    table.position = position;
    table.dimensions.length = tableDto.length;
    table.dimensions.width = tableDto.width;

    return table;
  }
}
