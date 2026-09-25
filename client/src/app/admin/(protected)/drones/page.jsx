import { DronesAdminView } from "./DronesAdminView";

export default function AdminDronesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-brand-navy-dark">Drones</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        The operational fleet available for assignment to operations.
      </p>
      <div className="mt-8">
        <DronesAdminView />
      </div>
    </div>
  );
}
