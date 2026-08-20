import { useNavigate, Link } from "react-router-dom";
import { UserRound, Bell, ClipboardList } from "lucide-react";
import { getToken, clearToken } from "@/lib/api";

export function LogbookPortal() {
  const navigate = useNavigate();
  const isLoggedIn = !!getToken();

  if (!isLoggedIn) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <h1 className="text-2xl font-semibold text-brand-navy-dark">Logbook Portal</h1>
        <p className="mt-2 text-muted-foreground">Log in to view your farmer logbook and mission history.</p>
        <Link
          to="/login"
          className="mt-6 rounded-full bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105"
        >
          Log In
        </Link>
      </main>
    );
  }

  function handleLogout() {
    clearToken();
    navigate("/");
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className="h-fit rounded-lg border border-border bg-background p-6 text-center">
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-brand-input">
            <UserRound className="size-9 text-muted-foreground" />
          </div>
          <p className="mt-3 font-semibold text-brand-navy-dark">Farmer Account</p>
          <p className="text-sm text-muted-foreground">Profile details pending backend connection.</p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 rounded-md bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/20"
          >
            Logout
          </button>
        </div>

        <div className="space-y-10">
          <div>
            <h2 className="flex items-center gap-2 font-semibold text-brand-navy-dark">
              <Bell className="size-4 text-brand-green" />
              System Notifications
            </h2>
            <div className="mt-3 rounded-md border-l-4 border-brand-green bg-brand-green/5 p-4 text-sm text-brand-navy-dark">
              Welcome! Your profile is active. You can request aerial services and view your logbook here.
            </div>
          </div>

          <div>
            <h2 className="flex items-center gap-2 font-semibold text-brand-navy-dark">
              <ClipboardList className="size-4 text-brand-green" />
              Recent Mission Logs
            </h2>
            <div className="mt-3 overflow-hidden rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-brand-input/60 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Date</th>
                    <th className="px-4 py-2.5 font-medium">Service</th>
                    <th className="px-4 py-2.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                      No mission logs yet.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
