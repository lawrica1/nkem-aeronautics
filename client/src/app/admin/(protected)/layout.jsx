import { AdminAuthGate } from "./AdminAuthGate";
import { AdminNav } from "./AdminNav";

export default function AdminProtectedLayout({ children }) {
  return (
    <AdminAuthGate>
      <div className="min-h-screen bg-slate-50">
        <AdminNav />
        {/* lg:pl-64 clears the fixed sidebar */}
        <div className="lg:pl-64">
          <main className="px-6 py-10 lg:px-10">{children}</main>
        </div>
      </div>
    </AdminAuthGate>
  );
}
