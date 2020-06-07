import { failure, success } from "result";
import { sequence } from "./sequence";

describe("sequence validations", () => {
  it("[success, success, success]", () => {
    const actual = sequence([success("good"), success(42), success(true)]);
    const expected = success(["good", 42, true]);
    expect(actual).toEqual(expected);

    if (actual.kind === "Failure") {
      throw new Error("unexpected failure");
    }

    expect(typeof actual.value[0]).toEqual("string");
    expect(typeof actual.value[1]).toEqual("number");
    expect(typeof actual.value[2]).toEqual("boolean");
  });

  it("[failure, success, success]", () => {
    const actual = sequence([failure(1), success(42), success(true)]);
    const expected = failure([1]);
    expect(actual).toEqual(expected);
  });

  it("[success, failure, success]", () => {
    const actual = sequence([success("good"), failure(2), success(true)]);
    const expected = failure([2]);
    expect(actual).toEqual(expected);
  });

  it("[success, success, failure]", () => {
    const actual = sequence([success("good"), success(42), failure(3)]);
    const expected = failure([3]);
    expect(actual).toEqual(expected);
  });

  it("[failure, failure, success]", () => {
    const actual = sequence([failure(1), failure(2), success(true)]);
    const expected = failure([1, 2]);
    expect(actual).toEqual(expected);
  });

  it("[failure, success, failure]", () => {
    const actual = sequence([failure(1), success(42), failure(3)]);
    const expected = failure([1, 3]);
    expect(actual).toEqual(expected);
  });

  it("[failure, failure, failure]", () => {
    const actual = sequence([failure(1), failure(2), failure(3)]);
    const expected = failure([1, 2, 3]);
    expect(actual).toEqual(expected);
  });
});
