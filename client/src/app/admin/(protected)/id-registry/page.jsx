import { IdRegistryView } from "./IdRegistryView";

export default function AdminIdRegistryPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-brand-navy-dark">ID Registry</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every printed staff ID card. Click a name to mark a card lost or returned.
      </p>
      <div className="mt-8">
        <IdRegistryView />
      </div>
    </div>
  );
}
