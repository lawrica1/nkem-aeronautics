import { AdminAuthGate } from "./AdminAuthGate";
import { AdminNav } from "./AdminNav";

export default function AdminProtectedLayout({ children }) {
  return (
    <AdminAuthGate>
      <div className="min-h-screen bg-background">
        <AdminNav />
        <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
      </div>
    </AdminAuthGate>
  );
}
