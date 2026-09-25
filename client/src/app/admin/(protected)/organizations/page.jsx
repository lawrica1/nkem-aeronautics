import { OrganizationsAdminView } from "./OrganizationsAdminView";

export default function AdminOrganizationsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-brand-navy-dark">Organizations</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Wildlife/security orgs, government agencies, and firms — link users to one from the Users page.
      </p>
      <div className="mt-8">
        <OrganizationsAdminView />
      </div>
    </div>
  );
}
