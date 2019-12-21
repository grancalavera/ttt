import { Button } from "@blueprintjs/core";
import React from "react";
import { Redirect, Link } from "react-router-dom";
import { Centered } from "./common/centered";
import { Loading } from "./common/loading";
import { useJoinMutation, useMyGamesQuery, Game } from "./generated/graphql";

export const Splash: React.FC = () => (
  <Centered>
    <MyGames />
    <NewGame />
  </Centered>
);

const MyGames: React.FC = () => {
  const { loading, data, error } = useMyGamesQuery({
    fetchPolicy: "no-cache",
  });

  if (error) {
    throw error;
  }

  if (loading) {
    return <Loading />;
  }

  if (data) {
    return (
      <>
        {data.myGames.map(game => (
          <GameButton game={game} key={game.id} />
        ))}
      </>
    );
  }

  throw new Error("undefined query state");
};

const GameButton: React.FC<{ game: Game }> = ({ game }) => {
  return (
    <Link to={`/game/${game.id}`}>
      <Button>{game.id}</Button>
    </Link>
  );
};

const NewGame: React.FC = () => {
  const [join, { data, loading }] = useJoinMutation();

  if (loading) {
    return <Loading />;
  }

  if (data) {
    const { gameId } = data.join;
    return <Redirect to={`/game/${gameId}`} />;
  }

  return <Button icon="play" onClick={() => join()} />;
};
