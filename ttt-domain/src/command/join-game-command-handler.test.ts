import { mockCommandDependencies } from "../test/support";
const spyOnFindFirstChallenge = jest.fn();
const spyOnFindMatch = jest.fn();

const mock = mockCommandDependencies({
  spyOnFindFirstChallenge,
  spyOnFindMatch,
});

describe("join game command handler", () => {
  it("noop", () => {});
});
