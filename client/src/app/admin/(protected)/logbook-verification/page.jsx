import { LogbookVerificationView } from "./LogbookVerificationView";

export default function AdminLogbookVerificationPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-brand-navy-dark">Logbook Verification</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Review each registered logbook and approve it once the details are confirmed. Approved logbooks show as
        verified in the owner&apos;s portal.
      </p>
      <div className="mt-8">
        <LogbookVerificationView />
      </div>
    </div>
  );
}
