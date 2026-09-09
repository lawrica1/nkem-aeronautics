import { RequestsAdminView } from "./RequestsAdminView";

export default function AdminRequestsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-brand-navy-dark">Requests</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Assign a pilot and drone to a service request, then record results once the operation is
        complete.
      </p>
      <div className="mt-8">
        <RequestsAdminView />
      </div>
    </div>
  );
}
