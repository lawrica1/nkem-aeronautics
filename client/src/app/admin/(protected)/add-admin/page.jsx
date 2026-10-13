"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/api";

const EMPTY = { name: "", email: "", password: "" };

export default function AddAdminPage() {
  const [form, setForm] = useState(EMPTY);
  const createAdmin = useMutation({
    mutationFn: (data) => apiRequest("/admin/admins", { method: "POST", body: data, admin: true }),
    onSuccess: () => setForm(EMPTY),
  });

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-brand-navy-dark">Add Admin</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Create a new admin account. They sign in at /admin/login with this email and password.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          createAdmin.mutate(form);
        }}
        className="mt-8 max-w-md space-y-4 rounded-2xl border border-border bg-white p-6 shadow-sm"
      >
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" required value={form.name} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required value={form.email} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Initial password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
          />
          <p className="text-xs text-muted-foreground">At least 8 characters. Share it privately.</p>
        </div>

        {createAdmin.isError && <p className="text-sm text-destructive">{createAdmin.error.message}</p>}
        {createAdmin.isSuccess && (
          <p className="text-sm text-green-700">Admin {createAdmin.data.email} created.</p>
        )}

        <Button type="submit" disabled={createAdmin.isPending} className="bg-brand-navy text-white hover:bg-brand-navy/90">
          {createAdmin.isPending ? "Creating…" : "Create admin"}
        </Button>
      </form>
    </div>
  );
}
