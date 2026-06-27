import { NextResponse } from "next/server";
import { getAdminStore, getStorePersistenceStatus } from "@/lib/admin-store";

export async function GET() {
  const store = await getAdminStore();
  return NextResponse.json({
    ...store,
    storage: getStorePersistenceStatus()
  });
}
