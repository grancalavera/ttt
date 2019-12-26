export * from "./game-join";
export * from "./game-play";
export * from "./game-status";
export * from "./game-my-token";

// export const myGames = (ctx: Context) => async (
//   user: UserEntity
// ): Promise<GameResult[]> => {
//   const { findGamesForUser } = ctx.dataSources.games;

//   const gameEntities = await findGamesForUser(user);
//   const gameResults = gameEntities.map(toGameResult);

//   return gameResults;
// };
