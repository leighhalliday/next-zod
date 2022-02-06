import type { NextApiRequest, NextApiResponse } from "next";
import { z, ZodError } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json({ success: true, errors: null });
}
