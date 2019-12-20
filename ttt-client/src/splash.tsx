import { Button } from "@blueprintjs/core";
import React from "react";
import { Centered } from "./common/centered";
import { Loading } from "./common/loading";
import { useJoinMutation, useMyGamesQuery } from "./generated/graphql";
import { Redirect } from "react-router-dom";

export const Splash: React.FC = () => (
  <Centered>
    <MyGames />
    <NewGame />
  </Centered>
);

const MyGames: React.FC = () => {
  const { loading, data } = useMyGamesQuery();

  if (loading) {
    return <Loading />;
  }

  if (data) {
    return (
      <ul>
        {data.myGames.map(g => (
          <li>Nothing</li>
        ))}
      </ul>
    );
  }

  throw new Error("invalid state");
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
