import { createUser } from "data-sources/users";
import "dotenv/config";
import { User } from "entity/user";
import { JoinResult, Token } from "generated/graphql";
import * as gameResolvers from "resolvers/game";
import { mockContext } from "test/mocks";
import { createConnection, getConnectionOptions } from "typeorm";

type Description = string;
type UserId = string;

interface Expected {
  next: Token;
  token: Token;
}

type Scenario = [Description, UserId, Expected];

const alice: UserId = "alice";
const bob: UserId = "bob";

describe("game resolvers", () => {
  beforeAll(async () => {
    const options = await getConnectionOptions("game-resolvers");
    const connection = await createConnection({
      ...options,
      name: "default",
    });
    await connection.dropDatabase();
    await connection.synchronize();
    await createUser(alice);
    await createUser(bob);
  });

  describe("joining games", () => {
    const scenarios: Scenario[] = [
      [
        "when alice is the first to join games",
        alice,
        { next: Token.O, token: Token.O },
      ],
      [
        "alice joins another game, and she should not play against herself",
        alice,
        { next: Token.O, token: Token.O },
      ],
      [
        "bob should be able to join as X for two games in a row",
        bob,
        { next: Token.O, token: Token.X },
      ],
      [
        "bob should be able to join as X for one more game",
        bob,
        { next: Token.O, token: Token.X },
      ],
      [
        "next time bob joins he should join as O",
        bob,
        { next: Token.O, token: Token.O },
      ],
      [
        "if alice joins now, she will join as X",
        alice,
        { next: Token.O, token: Token.X },
      ],
    ];

    describe.each(scenarios)("%s", (_, userId, expected) => {
      let result: JoinResult;

      beforeAll(async () => {
        const user = await User.findOne({ where: { id: userId } });
        if (user) {
          const context = mockContext(user);
          result = await gameResolvers.join(context)(user);
        } else {
          throw new Error(`userId "${userId}" does not exist`);
        }
      });

      it(`the assigned token should be ${expected.token}`, () => {
        expect(result.token).toBe(expected.token);
      });

      it(`the next token should be ${expected.next}`, () => {
        expect(result.next).toBe(expected.next);
      });
    });
  });
});
