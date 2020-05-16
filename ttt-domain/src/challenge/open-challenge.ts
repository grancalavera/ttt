import { OpenChallenge, OpenChallengeError, Result, Challenge } from "model";

export const openChallenge: OpenChallenge = ({ findChallenger }) => async ({
  challengerId,
}) => {
  const challengerResult = await findChallenger(challengerId);

  switch (challengerResult.kind) {
    case "ResultOk":
      throw new Error("not implemented");
    case "ResultFail":
      return Promise.resolve(challengerResult);
    default:
      assertNever(challengerResult);
  }
};

function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}
