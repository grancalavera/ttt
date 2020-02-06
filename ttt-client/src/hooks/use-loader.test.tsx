import { renderHook, act } from "@testing-library/react-hooks";
import { LoaderContextProvider, useIsLoading, useLoader } from "./use-loader";

type Id = number;
type Toggle = [Id, boolean];

interface Scenario {
  name: string;
  sequence: Toggle[];
  expected: boolean;
}

const scenarios: Scenario[] = [
  { name: "default", sequence: [], expected: true },
  { name: "trivially true", sequence: [[1, true]], expected: true },
  { name: "trivially false", sequence: [[1, false]], expected: false },
  {
    name: "one component, full cycle",
    sequence: [
      [1, true],
      [1, false],
    ],
    expected: false,
  },
  {
    name: "two components, one full cycle, one half cycle, interleaved",
    sequence: [
      [1, true],
      [2, true],
      [1, false],
    ],
    expected: true,
  },
  {
    name: "two components, two full cycles, interleaved",
    sequence: [
      [1, true],
      [2, true],
      [1, false],
      [2, false],
    ],
    expected: false,
  },
  {
    name: "one component, unbalanced, full cycle",
    sequence: [
      [1, true],
      [1, true],
      [1, false],
    ],
    expected: false,
  },
];
