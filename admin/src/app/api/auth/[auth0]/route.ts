import { handleAuth } from "@auth0/nextjs-auth0";
import { type NextApiHandler } from "next";

export const GET = handleAuth() as NextApiHandler;
