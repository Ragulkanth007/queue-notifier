import { z } from 'zod';

export const googleLoginSchema = z.object({
  email: z.string().email(),
  name: z.string().trim().min(1),
  image: z.string().url(),
  googleId: z.string().min(1)
});

export const getRoleSchema = z.object({
  email: z.string().email()
});
