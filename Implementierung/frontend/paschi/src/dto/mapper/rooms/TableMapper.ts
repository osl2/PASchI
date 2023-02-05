import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {Table} from "@/model/userdata/rooms/Table";
import {TableDto} from "@/dto/userdata/rooms/TableDto";

export class TableMapper implements IModelDtoMapper<Table, TableDto> {

  private static mapper: TableMapper = new TableMapper();

  private constructor() {
  }

  static getMapper(): TableMapper {
    return TableMapper.mapper;
  }

  dtoToModel(tableDto: TableDto): Table {
    return undefined;
  }

  modelToDto(table: Table): TableDto {
    return undefined;
  }

}
