import {BaseService} from "@/service/BaseService";
import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";
import {SeatArrangementDto} from "@/dto/userdata/courses/SeatArrangementDto";

export class SeatArrangementService extends BaseService<SeatArrangement, SeatArrangementDto> {

  private static readonly SEAT_ARRANGEMENT_BASE_URL: string = "";

  constructor(base_url: string, SEAT_ARRANGEMENT_BASE_URL: string) {
    super(SeatArrangementService.SEAT_ARRANGEMENT_BASE_URL);
  }

  add(e: SeatArrangement) {
    super.add(e);
  }

  update(e: SeatArrangement) {
    super.update(e);
  }

  getById(id: string) {
    super.getById(id);
  }

  getAll() {
    super.getAll();
  }

  delete(id: string) {
    super.delete(id);
  }
}
