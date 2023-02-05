import {BaseService} from "@/service/BaseService";
import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";
import {SeatArrangementDto} from "@/dto/userdata/courses/SeatArrangementDto";
import {SeatArrangementMapper} from "@/dto/mapper/courses/SeatArrangementMapper";

const SEAT_ARRANGEMENT_BASE_URL: string = '';

export class SeatArrangementService extends BaseService<SeatArrangement, SeatArrangementDto> {

  constructor() {
    super(SeatArrangementMapper.getMapper());
  }

  add(e: SeatArrangement) {
  }

  update(e: SeatArrangement) {
  }

  getById(id: string): SeatArrangement | undefined {
  }

  getAll(): SeatArrangement[] {
  }

  delete(id: string) {
  }
}
