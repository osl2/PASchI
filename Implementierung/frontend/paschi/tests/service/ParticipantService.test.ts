import {ParticipantService} from "@/service/ParticipantService";
import {createPinia, setActivePinia} from "pinia";
import {UserController} from "@/controller/UserController";
import {AdminController} from "@/controller/AdminController";
import {Student} from "@/model/userdata/interactions/Student";

const service = ParticipantService.getService();
let student: Student;

beforeAll(async () => {
  // await beforeEachTest();
  // TODO: Entfernen, wenn das Backend richtig läuft @ugqbo
  setActivePinia(createPinia());
  const admin = {email: "admin@kit.edu", password: "admin"};
  const user = {firstName: "Service", lastName: "Test", email: "service2@test.jest", password: "test"};
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

  student = new Student(
    undefined,
    0,
    userController.getUser(),
    "Luka",
    "Kosak"
  );
});

test("Add and get particpant", async () => {
  await service.add(student);
  const participants = (await service.getAll()).filter(participant => !participant.isTeacher());
  student.setId = participants[0].getId;

  expect(participants.length).toBe(1);
  expect(participants[0].firstName).toBe(student.firstName);
  expect(participants[0].lastName).toBe(student.lastName);
});

test("Get by id", async () => {
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
