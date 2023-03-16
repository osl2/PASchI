import {BASE_URL, BaseService} from "@/service/BaseService";
import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";
import {SeatArrangementDto} from "@/dto/userdata/courses/SeatArrangementDto";
import {SeatArrangementMapper} from "@/dto/mapper/courses/SeatArrangementMapper";
import axios, {AxiosResponse} from "axios";
import {useUserStore} from "@/store/UserStore";

const SEAT_ARRANGEMENT_BASE_URL: string = BASE_URL + "/api/seatarrangement";

export class SeatArrangementService extends BaseService<SeatArrangement, SeatArrangementDto> {

  private static seatArrangementService: SeatArrangementService = new SeatArrangementService();

  private constructor() {
    super(SeatArrangementMapper.getMapper());
  }

  static getService(): SeatArrangementService {
    return this.seatArrangementService;
  }

  async add(arrangement: SeatArrangement) {
    const token = useUserStore().getUser()?.token;
    const arrangementDto = this.getMapper().modelToDto(arrangement);
    await axios
      .post(SEAT_ARRANGEMENT_BASE_URL, arrangementDto, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response: AxiosResponse<SeatArrangementDto>) => {
        arrangement.setId = response.data.id;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async update(arrangement: SeatArrangement) {
    const token = useUserStore().getUser()?.token;
    const arrangementDto = this.getMapper().modelToDto(arrangement);
    await axios
      .put(SEAT_ARRANGEMENT_BASE_URL, arrangementDto, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async getById(id: string): Promise<SeatArrangement | undefined> {
    const token = useUserStore().getUser()?.token;
    let arrangement;
    await axios
      .get(SEAT_ARRANGEMENT_BASE_URL + `/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async (response: AxiosResponse<SeatArrangementDto>) => {
        arrangement = await this.getMapper().dtoToModel(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    return arrangement;
  }

  async getAll(): Promise<SeatArrangement[]> {
    const token = useUserStore().getUser()?.token;
    const arrangements: SeatArrangement[] = [];
    await axios
      .get(SEAT_ARRANGEMENT_BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async (response: AxiosResponse<SeatArrangementDto[]>) => {
        for (const arrangementDto of response.data) {
          arrangements.push(await this.getMapper().dtoToModel(arrangementDto));
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return arrangements;
  }

  async delete(id: string) {
    const token = useUserStore().getUser()?.token;
    await axios
      .delete(SEAT_ARRANGEMENT_BASE_URL, {
        params: {
          id,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
