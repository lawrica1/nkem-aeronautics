import { LogbooksExportView } from "./LogbooksExportView";

export default function AdminLogbooksPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-brand-navy-dark">Logbooks</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Download registered farmer records to hand off to affiliated firms.
      </p>
      <div className="mt-8">
        <LogbooksExportView />
      </div>
    </div>
  );
}
