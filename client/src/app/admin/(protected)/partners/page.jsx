import { PartnersAdminView } from "./PartnersAdminView";

export default function AdminPartnersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-brand-navy-dark">Partners</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Partner organisations Nkem shares requests with. Assign specific requests to a partner from
        the Requests page — partners see only what they&rsquo;ve been assigned, read-only.
      </p>
      <div className="mt-8">
        <PartnersAdminView />
      </div>
    </div>
  );
}
