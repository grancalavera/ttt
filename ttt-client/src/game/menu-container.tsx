import { Button, IconName, Spinner, Tooltip } from "@blueprintjs/core";
import React, { useCallback, useEffect } from "react";
import { Redirect } from "react-router-dom";
import create from "zustand";
import { routes } from "../app/app-constants";
import { Cell, Screen } from "../layout/layout";
import { useFakeMutation } from "./fake-menu-hooks";

interface MenuButtonProps {
  readonly disabled?: boolean;
  readonly icon: IconName;
}

interface MenuState {
  loading: boolean;
  toggleLoading: (x: boolean) => void;
}

const [useMenuState] = create<MenuState>((set) => ({
  loading: false,
  toggleLoading: (loading) => set({ loading }),
}));

const iconNames: IconName[] = ["time", "star", "star", "time"];

export const MenuContainer: React.FC = () => {
  const disabled = useMenuState((s) => s.loading);

  return (
    <Screen>
      <JoinGame disabled={disabled} />

      {iconNames.map((n, i) => (
        <ResumeGame icon={n} key={i} disabled={disabled} />
      ))}
    </Screen>
  );
};

const JoinGame = ({ disabled = false }: { disabled: boolean }) => {
  const [joinGame, { data, loading }] = useFakeMutation();
  const toggleLoading = useMenuState((s) => s.toggleLoading);

  useEffect(() => toggleLoading(loading), [toggleLoading, loading]);

  return (
    <Cell>
      {data ? (
        <Redirect to={`${routes.game}/${data}`} push />
      ) : loading ? (
        <Spinner size={Spinner.SIZE_SMALL} />
      ) : (
        <Tooltip content="join new game">
          <Button
            large
            icon="play"
            onClick={() => joinGame()}
            disabled={disabled}
            intent="success"
          />
        </Tooltip>
      )}
    </Cell>
  );
};

const ResumeGame = (props: MenuButtonProps) => {
  const [joinGame, { loading }] = useFakeMutation();
  const toggleLoading = useMenuState((s) => s.toggleLoading);

  useEffect(() => toggleLoading(loading), [toggleLoading, loading]);
  const handleClick = useCallback(() => {
    if (props.icon === "time") {
      return;
    }
    joinGame();
  }, [props.icon, joinGame]);

  return (
    <Cell>
      {loading ? (
        <Spinner size={Spinner.SIZE_SMALL} />
      ) : (
        <Tooltip content={props.icon === "star" ? "your turn" : "wait for your turn"}>
          <Button
            large
            minimal={props.icon === "time"}
            intent={props.icon === "time" ? "none" : "primary"}
            onClick={handleClick}
            disabled={props.disabled}
            icon={props.icon}
          />
        </Tooltip>
      )}
    </Cell>
  );
};
