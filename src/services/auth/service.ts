import { nanoid } from "nanoid";
import { cookies } from "next/headers";
import { sql } from "@/core/db";
import type { Session, User } from "./types";

const SESSION_COOKIE_NAME = "session_token";
const SESSION_DURATION_DAYS = 7;

// 세션 토큰 생성
const generateSessionToken = () => {
  return nanoid();
};

// 세션 생성
const createSession = async (userId: string) => {
  const token = generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  const result = (await sql`
    INSERT INTO sessions (user_id, token, expires_at)
    VALUES (${userId}, ${token}, ${expiresAt.toISOString()})
    RETURNING id, user_id, token, expires_at, created_at
  `) as Session[];

  return result[0] ?? null;
};

// 세션 검증
const getSessionByToken = async (token: string) => {
  const result = (await sql`
    SELECT *
    FROM sessions
    WHERE token = ${token}
    AND expires_at > NOW()
  `) as Session[];

  return result[0] ?? null;
};

// 세션 삭제
const deleteSession = async (token: string) => {
  await sql`DELETE FROM sessions WHERE token = ${token}`;
};

// 단일 사용자 조회 (비밀번호 기반 인증)
const getSingleUser = async () => {
  const result = (await sql`
    SELECT * FROM users ORDER BY created_at ASC LIMIT 1
  `) as User[];

  return result[0] ?? null;
};

// 사용자 ID로 조회
const getUserById = async (id: string) => {
  const result = (await sql`
    SELECT id, created_at FROM users WHERE id = ${id}
  `) as Omit<User, "password">[];

  return result[0] ?? null;
};

// 현재 세션 가져오기
const getCurrentSession = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return await getSessionByToken(token);
};

// 현재 사용자 가져오기
const getCurrentUser = async () => {
  const session = await getCurrentSession();
  if (!session) {
    return null;
  }

  return await getUserById(session.user_id);
};

// 로그인 (세션 생성 및 쿠키 설정)
const login = async (userId: string) => {
  const session = await createSession(userId);
  if (!session) {
    return null;
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60,
    path: "/",
  });

  return session;
};

const authService = {
  createSession,
  getSessionByToken,
  deleteSession,
  getSingleUser,
  getUserById,
  getCurrentSession,
  getCurrentUser,
  login,
};

export default authService;
