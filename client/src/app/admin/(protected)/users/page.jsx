import { UsersAdminView } from "./UsersAdminView";

export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-brand-navy-dark">Users</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Search registered accounts, verify one manually if an SMS never arrived, or change a role.
      </p>
      <div className="mt-8">
        <UsersAdminView />
      </div>
    </div>
  );
}
