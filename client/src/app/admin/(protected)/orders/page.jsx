import { OrdersAdminView } from "./OrdersAdminView";

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-brand-navy-dark">Orders</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Record an on-site sale, or confirm payment received on an online order (bank transfer,
        mobile money, or cash) — a receipt is issued automatically once an order is fully paid.
      </p>
      <div className="mt-8">
        <OrdersAdminView />
      </div>
    </div>
  );
}
