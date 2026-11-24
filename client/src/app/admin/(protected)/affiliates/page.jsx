import { AffiliatesView } from "./AffiliatesView";

export default function AdminAffiliatesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-brand-navy-dark">Affiliates</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Referral partners and their codes, by country. Click a name to edit or pause an affiliate.
      </p>
      <div className="mt-8">
        <AffiliatesView />
      </div>
    </div>
  );
}
