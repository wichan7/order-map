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

export const sql = neon(`${process.env.STORAGE_DATABASE_URL}`, { types });
