import { Suspense } from "react";
import { LoginView } from "./LoginView";

export const metadata = {
  title: "Log In — Nkem Aeronautics",
  description: "Sign in to your Nkem Aeronautics farmer workspace.",
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginView />
    </Suspense>
  );
}
