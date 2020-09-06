export function assertNever(never: never, message?: string) {
  throw new Error(message ?? `got ${never} but expected never`);
}

export function softAssertNever(never: never, message?: string) {
  console.error(message ?? `got ${never} but expected never`);
}
