import {RoomService} from "@/service/RoomService";
import {Room} from "@/model/userdata/rooms/Room";
import {createPinia, setActivePinia} from "pinia";
import {UserController} from "@/controller/UserController";
import {AdminController} from "@/controller/AdminController";
import {Chair} from "@/model/userdata/rooms/Chair";
import {Position} from "@/model/userdata/rooms/Position";

const service = RoomService.getService();
let room: Room;

beforeAll(async () => {
  // await beforeEachTest();
  // TODO: Entfernen, wenn das Backend richtig läuft @ugqbo
  setActivePinia(createPinia());
  const admin = {email: "admin@kit.edu", password: "admin"};
  const user = {firstName: "Service", lastName: "Test", email: "service3@test.jest", password: "test"};
  const userController = UserController.getUserController();
  const adminController = AdminController.getAdminController();

  await userController.register(
    user.firstName,
    user.lastName,
    user.email,
    user.password,
    user.password
  );

  await userController.login(admin.email, admin.password);
  const users = await adminController.getUsersNotAuthenticated();
  for (const user of users) {
    await adminController.authUser(user.getId);
  }

  setActivePinia(createPinia());

  await userController.login(user.email, user.password);

  room = new Room(
    undefined,
    0,
    userController.getUser(),
    "Raum"
  );
});

test("Add and get room", async () => {
  await service.add(room);
  const rooms = await service.getAll();
  room.setId = rooms[0].getId;

  expect(rooms.length).toBe(1);
  expect(rooms[0].name).toBe(room.name);
});

test("Get room by id", async () => {
  const _room = await service.getById(room.getId);

  expect(_room?.getId).toBe(room.getId);
  expect(_room?.name).toBe(room.name);
});

test("Update room", async () => {
  const chair = new Chair(
    undefined,
    0,
    UserController.getUserController().getUser(),
    new Position(
      undefined,
      0,
      UserController.getUserController().getUser(),
      0,
      0,
      0
    )
  );
  room.name = "Room";
  room.addRoomObject(chair);
  await service.update(room);
  const _room = await service.getById(room.getId);

  expect(_room?.name).toBe("Room");
  expect(_room?.roomObjects[0].isTable()).toBeFalsy();
});

test("Delete room", async () => {
  await service.delete(room.getId);
  const _room = await service.getById(room.getId);

  expect(_room).toBeUndefined();
});
