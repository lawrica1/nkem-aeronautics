import { QuotesAdminView } from "./QuotesAdminView";

export default function AdminQuotesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-brand-navy-dark">Quote Requests</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Requests submitted from the "Request A Quote" form on each catalogue sector.
      </p>
      <div className="mt-8">
        <QuotesAdminView />
      </div>
    </div>
  );
}
