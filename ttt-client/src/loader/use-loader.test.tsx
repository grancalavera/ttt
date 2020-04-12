import { renderHook } from "@testing-library/react-hooks";
import React from "react";
// see https://github.com/testing-library/react-hooks-testing-library/issues/173#issuecomment-531605122
import { act } from "react-test-renderer";
import { LoaderProvider, LoadingState, useLoader } from "./use-loader";

export interface Scenario {
  scenarioName: string;
  initialState: LoadingState;
  toggleSequence: boolean[];
  shouldForceHideBefore?: boolean;
  shouldForceHideAfter?: boolean;
  expected: boolean;
}

const LOADING = true;
const NOT_LOADING = !LOADING;
const SHOW = true;
const HIDE = !SHOW;

const scenarios: Scenario[] = [
  {
    scenarioName: "default: empty initial state and empty toggle sequence",
    initialState: [],
    toggleSequence: [],
    expected: NOT_LOADING
  },
  {
    scenarioName: "trivially loading",
    initialState: [],
    toggleSequence: [SHOW],
    expected: LOADING
  },
  {
    scenarioName: "trivially not loading",
    initialState: [],
    toggleSequence: [HIDE],
    expected: NOT_LOADING
  },
  {
    scenarioName: "one component full cycle",
    initialState: [],
    toggleSequence: [SHOW, HIDE],
    expected: NOT_LOADING
  },
  {
    scenarioName: "two components: one loading, one full cycle",
    initialState: [simulateSomethingIsLoading()],
    toggleSequence: [SHOW, HIDE],
    expected: LOADING
  },
  {
    scenarioName: "one component, unbalanced, full cycle",
    initialState: [],
    toggleSequence: [SHOW, SHOW, HIDE],
    expected: NOT_LOADING
  },
  {
    scenarioName: "force loading on startup",
    initialState: [simulateSomethingIsLoading()],
    toggleSequence: [],
    expected: LOADING
  },
  {
    scenarioName: "force hide: one loading from state and one loading from hook",
    initialState: [simulateSomethingIsLoading()],
    toggleSequence: [SHOW],
    shouldForceHideAfter: true,
    expected: NOT_LOADING
  },
  {
    scenarioName: "force hide: one loading from hook",
    initialState: [],
    toggleSequence: [SHOW],
    shouldForceHideAfter: true,
    expected: NOT_LOADING
  },
  {
    scenarioName: "force hide: one loading from state",
    initialState: [simulateSomethingIsLoading()],
    toggleSequence: [],
    shouldForceHideAfter: true,
    expected: NOT_LOADING
  },
  {
    scenarioName: "should clear all loading states on force hide",
    initialState: [simulateSomethingIsLoading()],
    toggleSequence: [true, false],
    shouldForceHideBefore: true,
    expected: NOT_LOADING
  }
];

describe.each(scenarios)("useLoader hook", scenario => {
  const {
    scenarioName,
    initialState,
    toggleSequence,
    shouldForceHideAfter,
    shouldForceHideBefore,
    expected
  } = scenario;

  const { result } = renderHook(() => useLoader(), {
    wrapper: ({ children }) => (
      <LoaderProvider loadingState={initialState}>{children}</LoaderProvider>
    )
  });

  if (shouldForceHideBefore) {
    act(() => {
      result.current.forceHide();
    });
  }

  toggleSequence.forEach(toggleTo => {
    act(() => {
      result.current.toggleLoader(toggleTo);
    });
  });

  if (shouldForceHideAfter) {
    act(() => {
      result.current.forceHide();
    });
  }

  it(scenarioName, () => {
    expect(result.current.isLoading).toBe(expected);
  });
});

function simulateSomethingIsLoading() {
  return Symbol();
}
