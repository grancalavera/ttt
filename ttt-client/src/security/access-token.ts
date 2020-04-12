let accessToken = "";
export const setAccessToken = (t: string) => (accessToken = t);
export const getAccessToken = (): string => accessToken;
