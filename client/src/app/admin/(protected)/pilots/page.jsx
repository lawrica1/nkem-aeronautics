import { PilotsAdminView } from "./PilotsAdminView";

export default function AdminPilotsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-brand-navy-dark">Pilots</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        The pilot roster available for assignment to operations.
      </p>
      <div className="mt-8">
        <PilotsAdminView />
      </div>
    </div>
  );
}
