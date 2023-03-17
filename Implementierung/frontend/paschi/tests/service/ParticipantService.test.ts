import {ParticipantService} from "@/service/ParticipantService";
import {UserController} from "@/controller/UserController";
import {Student} from "@/model/userdata/interactions/Student";
import {afterEachTest, beforeEachTest} from "../setup";

const service = ParticipantService.getService();
let student: Student;

beforeAll(async () => {
  await beforeEachTest();

  student = new Student(
    undefined,
    0,
    UserController.getUserController().getUser(),
    "Luka",
    "Kosak"
  );
});

afterAll(async () => {
  await afterEachTest();
});

test("Add and get particpant", async () => {
  await service.add(student);
  const participants = (await service.getAll()).filter(participant => !participant.isTeacher());
  student.setId = participants[0].getId;

  expect(participants.length).toBe(1);
  expect(participants[0].firstName).toBe(student.firstName);
  expect(participants[0].lastName).toBe(student.lastName);
});

test("Get participant by id", async () => {
  const participant = await service.getById(student.getId);

  expect(participant?.getId).toBe(student.getId);
  expect(participant?.firstName).toBe(student.firstName);
  expect(participant?.lastName).toBe(student.lastName);
});

test("Update participant", async () => {
  student.firstName = "Gregor";
  student.lastName = "Snelting";
  await service.update(student);
  const participant = await service.getById(student.getId);

  expect(participant?.firstName).toBe("Gregor");
  expect(participant?.lastName).toBe("Snelting");
});

test("Delete participant", async () => {
  await service.delete(student.getId);
  const participant = await service.getById(student.getId);

  expect(participant?.visible).toBeFalsy();
});
