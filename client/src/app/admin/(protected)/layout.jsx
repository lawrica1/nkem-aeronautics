import { AdminAuthGate } from "./AdminAuthGate";
import { AdminShell } from "./AdminNav";

export default function AdminProtectedLayout({ children }) {
  return (
    <AdminAuthGate>
      <div className="min-h-screen bg-slate-50">
        <AdminShell>{children}</AdminShell>
      </div>
    </AdminAuthGate>
  );
}
