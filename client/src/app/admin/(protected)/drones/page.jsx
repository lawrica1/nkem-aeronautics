import { DronesAdminView } from "./DronesAdminView";
import { ProductsAdminView } from "../products/ProductsAdminView";

export default function AdminDronesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-brand-navy-dark">Drones</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every drone in the system. Inactive catalogue items are hidden from the public website and shop.
      </p>
      <div className="mt-8 space-y-10">
        <ProductsAdminView title="Website & shop catalogue" />
        <DronesAdminView />
      </div>
    </div>
  );
}
