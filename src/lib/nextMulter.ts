import type { NextApiRequest, NextApiResponse } from "next";
import type { RequestHandler } from "express";

export function adaptMulter(middleware: RequestHandler) {
  return (
    req: NextApiRequest,
    res: NextApiResponse,
    next: (err?: any) => void
  ) => {
    middleware(req as any, res as any, next);
  };
}
