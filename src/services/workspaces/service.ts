import { sql } from "@/core/db";
import type { Workspace } from "@/services/workspaces/types";

const getOneById = async (id: Workspace["id"]) => {
  const result =
    (await sql`SELECT * FROM workspace WHERE id = ${id}`) as Workspace[];

  return result[0] ?? null;
};

const getOneByNm = async (nm: Workspace["nm"]) => {
  const result =
    (await sql`SELECT * FROM workspace WHERE nm = ${nm}`) as Workspace[];

  return result[0] ?? null;
};

const create = async (workspace: Pick<Workspace, "nm">) => {
  const result = (await sql`
  INSERT INTO workspace (
    nm
  ) VALUES (
   ${workspace.nm}
  ) RETURNING id, nm, created_at`) as Workspace[];

  return result[0] ?? null;
};

const getAll = async () => {
  const result =
    (await sql`SELECT * FROM workspace ORDER BY created_at DESC`) as Workspace[];

  return result;
};

const workspaceService = { getOneById, getOneByNm, create, getAll };

export default workspaceService;
