import {BaseService} from "@/service/BaseService";
import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";
import {SeatArrangementDto} from "@/dto/userdata/courses/SeatArrangementDto";
import {SeatArrangementMapper} from "@/dto/mapper/courses/SeatArrangementMapper";
import axios from "axios";

// TODO: URL
const SEAT_ARRANGEMENT_BASE_URL: string = '';

export class SeatArrangementService extends BaseService<SeatArrangement, SeatArrangementDto> {

  private static seatArrangementService: SeatArrangementService = new SeatArrangementService();

  private constructor() {
    super(SeatArrangementMapper.getMapper());
  }

  static getService(): SeatArrangementService {
    return this.seatArrangementService;
  }

  add(arrangement: SeatArrangement) {
    const arrangementDto = this.getMapper().modelToDto(arrangement);
    axios.post(SEAT_ARRANGEMENT_BASE_URL + '', arrangementDto).then((response) => {
      // irgendwas
    });
  }

  update(arrangement: SeatArrangement) {
    const arrangementDto = this.getMapper().modelToDto(arrangement);
    axios.post(SEAT_ARRANGEMENT_BASE_URL + '', arrangementDto).then((response) => {
      // irgendwas
    });
  }

  async getById(id: string): Promise<SeatArrangement | undefined> {
    let arrangement;
    await axios.get(SEAT_ARRANGEMENT_BASE_URL + '').then((response) => {
      arrangement = this.getMapper().dtoToModel(response.data);
    });

    if (arrangement != undefined) {
      return arrangement;
    } else {
      return undefined;
    }
  }

  async getAll(): Promise<SeatArrangement[]> {
    let arrangements: SeatArrangement[] = [];
    axios.get(SEAT_ARRANGEMENT_BASE_URL + '').then((response) => {
      response.data.forEach((course: any) => {
        arrangements.push(this.getMapper().dtoToModel(course));
      });
    });

    return arrangements;
  }

  delete(id: string) {
    axios.delete(SEAT_ARRANGEMENT_BASE_URL + '').then((response) => {
      // irgendwas
    });
  }
}
