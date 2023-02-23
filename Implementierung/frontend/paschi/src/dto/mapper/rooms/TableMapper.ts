import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {Table} from "@/model/userdata/rooms/Table";
import {TableDto} from "@/dto/userdata/rooms/TableDto";
import {PositionMapper} from "@/dto/mapper/rooms/PositionMapper";

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
    return undefined;
  }
}
