import Elysia, { error, t } from "elysia";
import bcrypt from "bcryptjs";
import { desc, eq } from "drizzle-orm";
import jwt, {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import { db } from "../database";
import { usersTable } from "../database/schema/user";

const SECRET = "your_jwt_secret";
const REFRESH_SECRET = "your_refresh_jwt_secret";

export interface Tokenizable {
  id: number;
  role: string;
}
const generateTokens = async (user: Tokenizable) => {
  const accessToken = jwt.sign({ id: user.id, role: user.role }, SECRET, {
    expiresIn: "5m",
  });
  const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

export const authMiddleware = async ({
  headers,
}: {
  headers: Record<string, string | undefined>;
}) => {
  const errorPayload = error(401, "No token");
  const token = headers.authorization?.split(" ")[1];
  if (!token) return errorPayload;
  try {
    const payload = jwt.verify(token, SECRET) as jwt.JwtPayload;
    return { userId: payload.id, role: payload.role };
  } catch {
    return errorPayload;
  }
};

export class UnauthorizeError extends Error {}

export class InvalidTokenError extends UnauthorizeError {}

export class UserExistsError extends Error {}

const authModule = (app: Elysia<"/api/auth">) =>
  app
    .post(
      "/login",
      async ({ body: { username, password } }) => {
        return await db.transaction(async (tx) => {
          const [user] = await tx
            .select()
            .from(usersTable)
            .where(eq(usersTable.username, username))
            .limit(1);

          if (!user) throw new UnauthorizeError();

          const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
          );
          if (!isPasswordCorrect) throw new UnauthorizeError();

          const now = new Date();
          await tx.update(usersTable).set({ updated_at: now, last_login: now });

          return generateTokens(user);
        });
      },
      {
        body: t.Object({
          username: t.String(),
          password: t.String(),
        }),
      }
    )
    .post(
      "/refresh",
      async ({ body: { refresh } }) => {
        const payload = jwt.verify(refresh, REFRESH_SECRET) as jwt.JwtPayload;
        const [user] = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.id, payload.id))
          .limit(1);

        if (!user) throw new UnauthorizeError();

        return generateTokens(user);
      },
      {
        body: t.Object({ refresh: t.String() }),
      }
    )
    .post(
      "/register",
      async ({ body, set }) => {
        const { username, first_name, last_name } = body;
        const password = await bcrypt.hash(body.password, 10);
        const now = new Date();

        const [isExist] = await db
          .select({ username: usersTable.username })
          .from(usersTable)
          .where(eq(usersTable.username, username));

        if (isExist) throw new UserExistsError();

        const [lastUser] = await db
          .select({ id: usersTable.id })
          .from(usersTable)
          .orderBy(desc(usersTable.id))
          .limit(1);
        const id = lastUser ? lastUser.id + 1 : 1;

        const [result] = await db
          .insert(usersTable)
          .values({
            username,
            password,
            first_name,
            last_name,
            vendor_id: 1,
            date_joined: now,
            is_active: true,
            is_staff: false,
            is_superuser: false,
            role: "VN",
            created_at: now,
            updated_at: now,
            id,
            email: "",
          })
          .returning();

        set.status = 201;

        return { data: result };
      },
      {
        body: t.Object({
          username: t.String(),
          password: t.String(),
          first_name: t.String(),
          last_name: t.String(),
        }),
      }
    )
    .onError(({ code, error: err }) => {
      if (code == "VALIDATION") return err.toResponse();
      if (err instanceof UnauthorizeError)
        return error(401, "Invalid username or password");
      if (err instanceof TokenExpiredError)
        return error(401, "Token has expired");
      if (err instanceof JsonWebTokenError) return error(401, "Invalid token");
      if (err instanceof NotBeforeError)
        return error(401, "Token is not yet active");
      if (err instanceof UserExistsError)
        return error(409, "This user is already exist");

      return error(401, JSON.stringify(err));
    });

export default authModule;
