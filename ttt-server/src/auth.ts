import { UserEntity } from "entity/user-entity";
import { sign, verify } from "jsonwebtoken";

export const REFRESH_TOKEN_COOKIE = "et3";

export type SecureResolver = <T = void>(
  runEffect: (user: UserEntity) => T | Promise<T>
) => T | Promise<T>;

type MakeSecureResolver = (user?: UserEntity) => SecureResolver;

export const mkSecureResolver: MakeSecureResolver = (user) => (runEffect) => {
  if (user) {
    return runEffect(user);
  } else {
    throw new Error("not authorized");
  }
};

export const findAuthenticatedUser = async (
  authorization?: string
): Promise<UserEntity | undefined> => {
  if (!authorization) {
    notAuthorized();
    return;
  }
  try {
    const tokenString = authorization.split(" ")[1];
    const token: any = decodeToken(tokenString);
    const user = await UserEntity.findOne({ where: { id: token.userId } });
    return user;
  } catch (e) {
    notAuthorized();
    return;
  }

  function notAuthorized() {
    console.info(`auth.findAuthenticatedUser: not authorized`);
  }
};

export const createAccessToken = (user: UserEntity) => {
  return sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
  });
};

export const createRefreshToken = (user: UserEntity) => {
  return sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
    }
  );
};

const decodeToken = (token: string) => {
  const secret = process.env.ACCESS_TOKEN_SECRET!;
  const payload = verify(token, secret);
  return payload;
};
