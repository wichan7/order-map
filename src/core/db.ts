import { neon } from "@neondatabase/serverless";

export const sql = neon(`${process.env.STORAGE_DATABASE_URL}`);
