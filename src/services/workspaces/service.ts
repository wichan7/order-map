import { sql } from "@/core/db";
import type { Workspace } from "@/services/workspaces/types";

const getOneById = async (id: Workspace["id"], userId: string) => {
  const result =
    (await sql`SELECT * FROM workspace WHERE id = ${id} AND user_id = ${userId}`) as Workspace[];

  return result[0] ?? null;
};

const getOneByNm = async (nm: Workspace["nm"], userId: string) => {
  const result =
    (await sql`SELECT * FROM workspace WHERE nm = ${nm} AND user_id = ${userId}`) as Workspace[];

  return result[0] ?? null;
};

const create = async (workspace: Pick<Workspace, "nm" | "user_id">) => {
  const result = (await sql`
  INSERT INTO workspace (
    nm, user_id
  ) VALUES (
   ${workspace.nm}, ${workspace.user_id}
  ) RETURNING id, user_id, nm, created_at`) as Workspace[];

  return result[0] ?? null;
};

const getAll = async (userId: string) => {
  const result =
    (await sql`SELECT * FROM workspace WHERE user_id = ${userId} ORDER BY created_at DESC`) as Workspace[];

  return result;
};

const workspaceService = { getOneById, getOneByNm, create, getAll };

export default workspaceService;
