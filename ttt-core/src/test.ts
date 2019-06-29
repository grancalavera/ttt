import * as common from "./test-common";
import * as game from "./test-game";
import * as simulation from "./test-simulation";

try {
  common.test();
  game.test();
  simulation.test();
} catch (e) {
  console.log(e.message);
  console.log();
  console.log("actual:");
  console.log(e.actual);
  console.log("expected:");
  console.log(e.expected);
  process.exit(1);
}
