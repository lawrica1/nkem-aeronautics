import { PartRequestsAdminView } from "./PartRequestsAdminView";

export default function AdminPartRequestsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-brand-navy-dark">Part Requests</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Customers unsure which drone part they need, with a photo or video attached where provided.
      </p>
      <div className="mt-8">
        <PartRequestsAdminView />
      </div>
    </div>
  );
}
