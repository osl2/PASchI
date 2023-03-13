import {RoomController} from "@/controller/RoomController";
import {Room} from "@/model/userdata/rooms/Room";
import {UserController} from "@/controller/UserController";
import {AdminController} from "@/controller/AdminController";
import {createPinia, setActivePinia} from "pinia";

const roomController = RoomController.getRoomController();
const roomName = "room";
let roomId: string;
let room: Room | undefined;
let tableId: string | undefined;
let chairId: string | undefined;

beforeAll(async () => {
  // await beforeEachTest();
  // TODO: Entfernen, wenn das Backend richtig läuft @ugqbo
  setActivePinia(createPinia());
  const admin = {email: "admin@kit.edu", password: "admin"};
  const user = {firstName: "Test", lastName: "2", email: "test2@test.jest", password: "test"};
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
});

afterAll(async () => {
  // await afterEachTest();
});

test("Create room", async () => {
  roomId = await roomController.createRoom(roomName);
  room = roomController.getRoom(roomId);

  expect(room).toBeDefined();
  expect(room?.name).toBe(roomName);
});

test("Add chair", async () => {
  const position = {x: 0, y: 0, angle: 0};
  roomController.addChair("24", position.x, position.y, position.angle);
  roomController.addChair(roomId, position.x, position.y, position.angle);
  await roomController.saveRoom(roomId);
  chairId = roomController.getRoomObjects(roomId)![0].getId;
  const chair = roomController.getRoomObject(roomId, chairId!);

  expect(chair?.position.xCoordinate).toBe(position.x);
  expect(chair?.position.yCoordinate).toBe(position.y);
  expect(chair?.position.orientation).toBe(position.angle);
});

test("Add table", async () => {
  const position = {x: 0, y: 0, angle: 0};
  const dimension = {length: 10, width: 10};
  roomController.addTable("24", position.x, position.y, position.angle, dimension.length,
    dimension.width);
  tableId = roomController.addTable(roomId, position.x, position.y, position.angle, dimension.length,
    dimension.width);
  await roomController.saveRoom(roomId);
  tableId = roomController.getRoomObjects(roomId)?.filter(object => object.isTable())[0].getId;
  const table = roomController.getRoomObject(roomId, tableId!);

  expect(table?.position.xCoordinate).toBe(position.x);
  expect(table?.position.yCoordinate).toBe(position.y);
  expect(table?.position.orientation).toBe(position.angle);
  expect(table?.dimensions.length).toBe(dimension.length);
  expect(table?.dimensions.width).toBe(dimension.width);
});

test("Get and delete all room objects", async () => {
  const objects = roomController.getRoomObjects(roomId);

  expect(objects?.length).toBe(2);

  await roomController.removeRoomObject(roomId, chairId!);
  await roomController.removeRoomObject(roomId, tableId!);

  expect(objects?.length).toBe(0);
});

test("Get all rooms", () => {
  const rooms = roomController.getAllRooms();

  expect(rooms.length).toBeGreaterThan(0);
});

test("Delete room", async () => {
  await roomController.deleteRoom(roomId);
  room = roomController.getRoom(roomId);
  const rooms = roomController.getAllRooms();

  expect(room).toBeUndefined();
  expect(rooms.length).toBe(0);
});
