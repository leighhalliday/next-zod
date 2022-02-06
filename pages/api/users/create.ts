import type { NextApiRequest, NextApiResponse } from "next";
import { z, ZodError } from "zod";

/*
{
  "name": "Leigh Halliday",
  "email": "leigh@email.com",
  "confirmEmail": "leigh@email.com",
  "role": "Senior Engineer",
  "websiteUrl": "https://www.leighhalliday.com",
  "available": true,
  "experience": [
    { "lang": "PHP", "years": 15 },
    { "lang": "Ruby", "years": 10 },
    { "lang": "React", "years": 5 }
  ],
  "coupon": "ABCD123"
}
*/

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = await saveData(req.body);
  res.status(200).json(result);
}

const Experience = z.object({
  lang: z.string(),
  years: z.number().positive(),
});

const User = z
  .object({
    name: z.string(),
    email: z.string().email(),
    confirmEmail: z.string().email(),
    role: z.enum(["Senior Engineer", "Staff Engineer", "Engineering Manager"]),
    websiteUrl: z.string().url().nullable().optional(),
    available: z.boolean(),
    experience: z.array(Experience),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Email and confirmEmail should be equal",
    path: ["confirmEmail"],
  });

async function saveData(
  rawData: any
): Promise<{ success: boolean; errors: any }> {
  try {
    const data = User.parse(rawData);
    console.log("Saving Data", data);
  } catch (e) {
    if (e instanceof ZodError) {
      return { success: false, errors: e.flatten() };
    } else {
      throw e;
    }
  }

  return { success: true, errors: null };
}
