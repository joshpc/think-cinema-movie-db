import { expect, test } from "vitest";
import { createHandle, handleForPerson } from "../../../api/actions/utils/handleUtils"

test("special characters should be removed when creating a handle", () => {
  let handle = createHandle("BáÑana--world!")
  expect(createHandle("BáÑana--world!")).toBe("banana_world");
  expect(createHandle("Hello, world!")).toBe("hello_world");
  expect(createHandle("basic")).toBe("basic");
  expect(createHandle("very long sentence and then some")).toBe("very_long_sentence_and_then_some");
  expect(createHandle("🚀🌟💫🎉🔥")).toBe("");
  expect(createHandle("   ")).toBe("");
  expect(createHandle("123456789")).toBe("123456789");
  expect(createHandle("CamelCaseText")).toBe("camelcasetext");
  expect(createHandle("multiple---dashes___underscores")).toBe("multiple_dashes_underscores");
  expect(createHandle("tab\there\nand\nnewlines")).toBe("tab_here_and_newlines");
  expect(createHandle("Ñoño!@#$%^&*()[]{}|\\:;\"'<>?/.,`~+=")).toBe("nono");
  expect(createHandle("àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ")).toBe("aaaaaaceeeeiiiinooooouuuuyy");
  expect(createHandle("mix3d_Numb3rs&Letters!")).toBe("mix3d_numb3rsletters");
  expect(createHandle("trailing spaces and punctuation   !!!")).toBe("trailing_spaces_and_punctuation");
});

test("should return an empty string for empty string", () => {
  expect(createHandle("")).toBe("");
});

test("handleForPerson should generate unique handles for actors", () => {
  expect(handleForPerson({
    firstName: "John",
    middleName: "Michael",
    lastName: "Doe",
    birthYear: 1980
  })).toBe("john_michael_doe_1980");

  expect(handleForPerson({
    firstName: "Jane",
    middleName: "",
    lastName: "Smith",
    birthYear: 1990
  })).toBe("jane_smith_1990");

  expect(handleForPerson({
    firstName: "Bob",
    middleName: null,
    lastName: "Johnson",
    birthYear: 0
  })).toBe("bob_johnson");

  expect(handleForPerson({
    firstName: "Alice",
    middleName: undefined,
    lastName: "Brown",
    birthYear: -1
  })).toBe("alice_brown");

  expect(handleForPerson({
    firstName: "Charlie",
    middleName: "Ray",
    lastName: "Wilson",
    birthYear: 2000
  })).toBe("charlie_ray_wilson_2000");
});

test("createHandle should handle strange names", () => {
  expect(createHandle("___leading_and_trailing___")).toBe("leading_and_trailing");
  expect(createHandle("中文字符")).toBe("");
  expect(createHandle("русский текст")).toBe("");
  expect(createHandle("_")).toBe("");
  expect(createHandle("123_abc_456")).toBe("123_abc_456");
  expect(createHandle("A")).toBe("a");
  expect(createHandle("a_b_c_d_e")).toBe("a_b_c_d_e");
});
