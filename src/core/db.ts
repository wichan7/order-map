import { neon, types } from "@neondatabase/serverless";
import dayjs from "dayjs";

types.setTypeParser(types.builtins.TIMESTAMP, (v) =>
  dayjs(v).format("YYYY-MM-DD HH:mm:ss"),
);
types.setTypeParser(types.builtins.TIMESTAMPTZ, (v) =>
  dayjs(v).format("YYYY-MM-DD HH:mm:ss"),
);
types.setTypeParser(types.builtins.DATE, (v) =>
  dayjs(v).format("YYYY-MM-DD HH:mm:ss"),
);

const nullToUndefined = <T>(value: T): T => {
  if (value === null) return undefined as unknown as T;
  if (Array.isArray(value)) return value.map(nullToUndefined) as unknown as T;
  if (typeof value === "object")
    return Object.fromEntries(
      Object.entries(value as object).map(([k, v]) => [k, nullToUndefined(v)]),
    ) as T;
  return value;
};

const _sql = neon(`${process.env.STORAGE_DATABASE_URL}`, { types });

export const sql = new Proxy(_sql, {
  async apply(target, thisArg, args) {
    const rows = await (
      target as (...a: unknown[]) => Promise<unknown[]>
    ).apply(thisArg, args);
    return rows.map(nullToUndefined);
  },
});
