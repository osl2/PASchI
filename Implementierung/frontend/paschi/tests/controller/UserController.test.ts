import {UserController} from "@/controller/UserController";
import {setActivePinia, createPinia} from "pinia";

// TODO: Backend

setActivePinia(createPinia());
const userController = UserController.getUserController();
const firstName = "Gregor";
const lastName = "Snelting";
const email = "snelting@kit.edu";
const password = "exmatrikulaion";
userController.register(firstName, lastName, email, password, password);
const user = userController.getUser()!;

test('register', () => {
  expect(user.firstName).toBe(firstName);
  expect(user.lastName).toBe(lastName);
  expect(user.email).toBe(email);
});

test("login", () => {
  expect(userController.login(email, password)).toBe(false);
  user.auth = true;
  expect(userController.login(email, password)).toBe(true);
});

test("update", () => {
  const newFirstName = "Walter";
  const newLastName = "Tichy";
  const newEmail = "tichy@kit.edu";
  userController.update(newFirstName, newLastName, newEmail, password);

  expect(user.firstName).toBe(newFirstName);
  expect(user.lastName).toBe(newLastName);
  expect(user.email).toBe(newEmail);
});
