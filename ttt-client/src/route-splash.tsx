import { Button } from "@blueprintjs/core";
import { assertNever, isJust, Maybe } from "@grancalavera/ttt-core";
import React, { ReactElement } from "react";
import {
  ACTIVITY_FAILED,
  ACTIVITY_IDLE,
  ACTIVITY_LOADING,
  ACTIVITY_SUCCESS,
  isLoading,
} from "./common/activity-state";
import { Content } from "./common/layout";
import {
  GameChangedSubscription,
  GameState,
  useGameChangedSubscription,
  useOpenGameMutation,
  Token,
  GamePlayingState,
} from "./generated/graphql";
import { useActivityState } from "./hooks/use-activity-state";
import { useLoader } from "./hooks/use-loader";

export const SplashRoute: React.FC = () => {
  const { toggleLoader } = useLoader();

  const [openGame, openGameResult] = useOpenGameMutation();
  const openGameState = useActivityState(openGameResult);
  toggleLoader(isLoading(openGameState));

  switch (openGameState.kind) {
    case ACTIVITY_IDLE:
      return (
        <Content>
          <Button
            icon="play"
            onClick={() => openGame({ variables: { channelId: "some channel" } })}
          />
        </Content>
      );
    case ACTIVITY_LOADING:
    case ACTIVITY_FAILED:
      return null;
    case ACTIVITY_SUCCESS:
      return <Game channelId={openGameState.data.openGame.channelId} />;
    default:
      return assertNever(openGameState);
  }
};

interface GameProps {
  channelId: string;
}

const Game: React.FC<GameProps> = ({ channelId }) => {
  const { data } = useGameChangedSubscription({ variables: { input: { channelId } } });

  const renderGameChanged = renderSubscriptionState<
    "gameChanged",
    GameState,
    GameChangedSubscription
  >("gameChanged", data);

  return renderGameChanged((state) => {
    switch (state.__typename) {
      case "GamePlayingState": {
        const ms = (
          <>
            {state.moves.map((m, i) => (
              <span key={`${m.position}-${m.token}`}>
                {m.position} {m.token}
              </span>
            ))}
          </>
        );
        return ms;
      }
      case "GameOverDrawState":
        return null;
      case "GameOverWonState":
        return null;
      default:
        return assertNever(state);
    }
  });
};

type WithTypename = { __typename?: string };
type WithState<TKey extends string, TState extends WithTypename> = Record<
  TKey,
  {
    state: TState;
  }
>;

type RenderSubscriptionState<TState extends WithTypename> = (
  state: Required<TState>
) => ReactElement | null;

const renderSubscriptionState = <
  TKey extends string,
  TState extends WithTypename,
  TData extends WithState<TKey, TState>
>(
  key: TKey,
  data: Maybe<TData>
) => (render: RenderSubscriptionState<TState>) => {
  if (isJust(data) && isJust(data[key].state.__typename)) {
    const state = data[key].state as Required<TState>;
    return render(state);
  }
  return null;
};
