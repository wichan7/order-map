import { sql } from "@/core/db";

export type Workspace = {
  id: string;
  nm: string;
  createdAt: string;
};

const selectOneById = async (id: Workspace["id"]) => {
  const result =
    (await sql`SELECT * FROM workspace WHERE id = ${id}`) as Workspace[];

  return result[0] ?? null;
};

const selectOneByNm = async (nm: Workspace["nm"]) => {
  const result =
    (await sql`SELECT * FROM workspace WHERE nm = ${nm}`) as Workspace[];

  return result[0] ?? null;
};

const insert = async (workspace: Pick<Workspace, "nm">) => {
  const result = (await sql`
  INSERT INTO workspace (
    nm
  ) VALUES (
   ${workspace.nm}
  ) RETURNING id, nm, created_at`) as Workspace[];

  return result[0] ?? null;
};

export default { selectOneById, selectOneByNm, insert };
