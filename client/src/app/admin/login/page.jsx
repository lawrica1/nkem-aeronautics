"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest, setAdminToken } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      const data = await apiRequest("/admin/login", { method: "POST", body: form });
      setAdminToken(data.token);
      router.push("/admin/logbooks");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-brand-navy-dark">Admin Sign In</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Internal use only — logbook export and reporting.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full bg-brand-navy text-white" disabled={isPending}>
            {isPending ? "Signing in…" : "Sign In"}
          </Button>
        </form>
      </div>
    </main>
  );
}
