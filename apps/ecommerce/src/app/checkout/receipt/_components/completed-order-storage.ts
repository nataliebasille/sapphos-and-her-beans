"use server";

import { cookies } from "next/headers";
import type { CompletedOrder } from "./completed-order";

const COMPLETED_ORDER_COOKIE = "sappho-completed-order";

export async function saveCompletedOrder(order: CompletedOrder) {
  const cookieStore = await cookies();

  cookieStore.set(COMPLETED_ORDER_COOKIE, JSON.stringify(order), {
    httpOnly: true,
    maxAge: 60 * 60 * 2,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function loadCompletedOrder(): Promise<CompletedOrder | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(COMPLETED_ORDER_COOKIE)?.value;
  if (!value) return null;

  try {
    return JSON.parse(value) as CompletedOrder;
  } catch {
    return null;
  }
}
