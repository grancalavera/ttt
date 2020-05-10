// no idea why, but
// export { failProxy } from "common/fail-proxy";
// does not work
import { failProxy } from "common/fail-proxy";

export { Background } from "common/background";
export { GlobalStyle } from "common/global-style";
export { Layout } from "common/layout";
export * from "common/set-state";
export { failProxy };
