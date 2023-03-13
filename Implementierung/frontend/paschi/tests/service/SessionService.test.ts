import {SessionService} from "@/service/SessionService";
import {Session} from "@/model/userdata/courses/Session";
import {UserController} from "@/controller/UserController";
import {Course} from "@/model/userdata/courses/Course";
import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";
import {CourseService} from "@/service/CourseService";
import {Room} from "@/model/userdata/rooms/Room";
import {RoomService} from "@/service/RoomService";
import {SeatArrangementService} from "@/service/SeatArrangementService";
import {afterEachTest, beforeEachTest} from "../setup";

const service = SessionService.getService();
let session: Session;

beforeAll(async () => {
  await beforeEachTest();
  const userController = UserController.getUserController();

  const room = new Room(
    undefined,
    0,
    userController.getUser(),
    "Raum"
  );
  await RoomService.getService().add(room);

  const course = new Course(
    undefined,
    0,
    userController.getUser(),
    "Kurs",
    "Fach"
  );
  await CourseService.getService().add(course);

  const arrangement = new SeatArrangement(
    undefined,
    0,
    userController.getUser(),
    "Sitzordnung",
    course,
    room
  );
  await SeatArrangementService.getService().add(arrangement);

  session = new Session(
    undefined,
    0,
    userController.getUser(),
    "Session",
    new Date().toISOString(),
    course,
    arrangement
  );
});

afterAll(async () => {
  await afterEachTest();
});

test("Add and get session", async () => {
  await service.add(session);
  const sessions = await service.getAll();
  session.setId = sessions[0].getId;

  expect(sessions.length).toBe(1);
  expect(sessions[0].name).toBe(session.name);
  expect(sessions[0].date).toBe(session.date);
});

test("Get session by id", async () => {
  const _session = await service.getById(session.getId);

  expect(_session?.getId).toBe(session.getId);
  expect(_session?.name).toBe(session.name);
  expect(_session?.date).toBe(session.date);
});

test("Update session", async () => {
  session.name = "Sitzung";
  await service.update(session);
  const _session = await service.getById(session.getId);

  expect(_session?.name).toBe("Sitzung");
});

test("Delete session", async () => {
  await service.delete(session.getId);
  const _session = await service.getById(session.getId);

  expect(_session).toBeUndefined();
});
