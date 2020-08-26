export function assertNever(never: never, message?: string) {
  throw new Error(message ?? `got ${never} but expected never`);
}
