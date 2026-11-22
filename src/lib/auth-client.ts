
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Uses the frontend's /api/auth endpoint.
  // Next.js forwards requests to the Express backend.
  fetchOptions: {
    credentials: "include",
  },
});
