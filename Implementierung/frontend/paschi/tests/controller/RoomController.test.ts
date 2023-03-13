import {RoomController} from "@/controller/RoomController";
import {Room} from "@/model/userdata/rooms/Room";
import {afterEachTest, beforeEachTest} from "../setup";

const roomController = RoomController.getRoomController();
const roomName = "room";
let roomId: string;
let room: Room | undefined;
let tableId: string | undefined;
let chairId: string | undefined;

beforeAll(async () => {
  await beforeEachTest();
});

afterAll(async () => {
  await afterEachTest();
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
  let objects = roomController.getRoomObjects(roomId);

  expect(objects?.length).toBe(2);

  await roomController.removeRoomObject(roomId, chairId!);
  await roomController.removeRoomObject(roomId, tableId!);
  objects = roomController.getRoomObjects(roomId);

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
