import {BaseService} from "@/service/BaseService";
import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";
import {SeatArrangementDto} from "@/dto/userdata/courses/SeatArrangementDto";
import {SeatArrangementMapper} from "@/dto/mapper/courses/SeatArrangementMapper";
import axios, {AxiosResponse} from "axios";
import {useUserStore} from "@/store/UserStore";

const SEAT_ARRANGEMENT_BASE_URL: string = 'http://193.196.37.141/api/seatarrangement';

export class SeatArrangementService extends BaseService<SeatArrangement, SeatArrangementDto> {

  private static seatArrangementService: SeatArrangementService = new SeatArrangementService();
  private userStore = useUserStore();

  private constructor() {
    super(SeatArrangementMapper.getMapper());
  }

  static getService(): SeatArrangementService {
    return this.seatArrangementService;
  }

  add(arrangement: SeatArrangement) {
    const arrangementDto = this.getMapper().modelToDto(arrangement);
    axios.post(SEAT_ARRANGEMENT_BASE_URL, arrangementDto).catch((error) => {
      console.log(error);
    });
  }

  update(arrangement: SeatArrangement) {
    const token = this.userStore.getUser()?.token;
    const arrangementDto = this.getMapper().modelToDto(arrangement);
    axios.put(SEAT_ARRANGEMENT_BASE_URL, arrangementDto, {
      headers: {
        'Authorization': token
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  async getById(id: string): Promise<SeatArrangement | undefined> {
    const token = this.userStore.getUser()?.token;
    let arrangement;
    await axios.get(SEAT_ARRANGEMENT_BASE_URL + `/${id}`, {
      headers: {
        'Authorization': token
      }
    }).then((response: AxiosResponse<SeatArrangementDto>) => {
      arrangement = this.getMapper().dtoToModel(response.data);
    }).catch((error) => {
      console.log(error);
    });

    if (arrangement != undefined) {
      return arrangement;
    } else {
      return undefined;
    }
  }

  async getAll(): Promise<SeatArrangement[]> {
    const token = this.userStore.getUser()?.token;
    let arrangements: SeatArrangement[] = [];
    axios.get(SEAT_ARRANGEMENT_BASE_URL, {
      headers: {
        'Authorization': token
      }
    }).then((response: AxiosResponse<SeatArrangementDto[]>) => {
      response.data.forEach((arrangementDto: SeatArrangementDto) => {
        arrangements.push(this.getMapper().dtoToModel(arrangementDto));
      });
    }).catch((error) => {
      console.log(error);
    });

    return arrangements;
  }

  delete(id: string) {
    const token = this.userStore.getUser()?.token;
    axios.delete(SEAT_ARRANGEMENT_BASE_URL, {
      params: {
        id
      },
      headers: {
        'Authorization': token
      }
    }).catch((error) => {
      console.log(error);
    });
  }
}
