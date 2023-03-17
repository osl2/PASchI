import {RoomService} from "@/service/RoomService";
import {Room} from "@/model/userdata/rooms/Room";
import {UserController} from "@/controller/UserController";
import {Chair} from "@/model/userdata/rooms/Chair";
import {Position} from "@/model/userdata/rooms/Position";
import {afterEachTest, beforeEachTest} from "../setup";

const service = RoomService.getService();
let room: Room;

beforeAll(async () => {
  await beforeEachTest();

  room = new Room(
    undefined,
    0,
    UserController.getUserController().getUser(),
    "Raum"
  );
});

afterAll(async () => {
  await afterEachTest();
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
