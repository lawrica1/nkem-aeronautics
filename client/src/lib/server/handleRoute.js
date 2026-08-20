import { NextResponse } from "next/server";
import { HttpError } from "@/lib/server/httpError";

// Wraps a route handler so any HttpError (or the odd programmer error)
// becomes a proper JSON error response instead of an unhandled 500 crash.
export function handleRoute(fn) {
  return async (request) => {
    try {
      return await fn(request);
    } catch (error) {
      if (error instanceof HttpError) {
        return NextResponse.json({ message: error.message }, { status: error.status });
      }
      console.error(error);
      return NextResponse.json({ message: "Internal server error." }, { status: 500 });
    }
  };
}
