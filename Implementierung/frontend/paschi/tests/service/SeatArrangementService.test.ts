import {SeatArrangementService} from "@/service/SeatArrangementService";
import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";
import {UserController} from "@/controller/UserController";
import {Course} from "@/model/userdata/courses/Course";
import {Room} from "@/model/userdata/rooms/Room";
import {RoomService} from "@/service/RoomService";
import {CourseService} from "@/service/CourseService";
import {afterEachTest, beforeEachTest} from "../setup";

const service = SeatArrangementService.getService();
let arrangement: SeatArrangement;

beforeAll(async () => {
  await beforeEachTest();
  const userController = UserController.getUserController();

  const course = new Course(
    undefined,
    0,
    userController.getUser(),
    "Kurs",
    "Fach"
  );
  await CourseService.getService().add(course);

  const room = new Room(
    undefined,
    0,
    userController.getUser(),
    "Raum"
  );
  await RoomService.getService().add(room);

  arrangement = new SeatArrangement(
    undefined,
    0,
    userController.getUser(),
    "Sitzordnung",
    course,
    room
  );
});

afterAll(async () => {
  await afterEachTest();
});

test("Add and get seat arrangement", async () => {
  await service.add(arrangement);
  const arrangements = await service.getAll();
  arrangement.setId = arrangements[0].getId;

  expect(arrangements.length).toBe(1);
  expect(arrangements[0].name).toBe(arrangement.name);
});

test("Get seat arrangement by id", async () => {
  const _arrangement = await service.getById(arrangement.getId);

  expect(_arrangement?.getId).toBe(arrangement.getId);
  expect(_arrangement?.name).toBe(arrangement.name);
});

test("Update seat arrangement", async () => {
  arrangement.name = "Sitzordnung 2";
  await service.update(arrangement);
  const _arrangement = await service.getById(arrangement.getId);

  expect(_arrangement?.name).toBe("Sitzordnung 2");
});

test("Delete seat arrangement", async () => {
  await service.delete(arrangement.getId);
  const _arrangement = await service.getById(arrangement.getId);

  expect(_arrangement).toBeUndefined();
});
