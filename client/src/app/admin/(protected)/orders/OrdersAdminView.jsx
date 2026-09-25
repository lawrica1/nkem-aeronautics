"use client";

import { useState } from "react";
import { useAdminOrders, useCreateAdminOrder, useUpdateOrderStatus, useRecordPayment } from "@/hooks/useOrders";
import { useAdminProducts } from "@/hooks/useProducts";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { formatXAF } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30";

const STATUS_OPTIONS = [
  ["pending_payment", "Pending Payment"],
  ["paid", "Paid"],
  ["processing", "Processing"],
  ["ready", "Ready / Dispatched"],
  ["completed", "Completed"],
  ["cancelled", "Cancelled"],
  ["payment_failed", "Payment Failed"],
];

const PAYMENT_METHODS = [
  ["cash", "Cash"],
  ["mobile_money", "Mobile Money"],
  ["bank_transfer", "Bank Transfer"],
  ["card", "Card"],
];

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function OnSiteSaleForm() {
  const { data: products } = useAdminProducts();
  const createOrder = useCreateAdminOrder();
  const [userSearch, setUserSearch] = useState("");
  const { data: users } = useAdminUsers({ search: userSearch });
  const [userId, setUserId] = useState("");
  const [lines, setLines] = useState([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  function addLine() {
    if (!productId) return;
    setLines([...lines, { productId, quantity: Number(quantity) || 1 }]);
    setProductId("");
    setQuantity(1);
  }

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-brand-navy-dark">Record an on-site sale</p>

      <div className="space-y-1.5">
        <Label>Customer</Label>
        <input className={fieldClass} placeholder="Search name or email…" value={userSearch} onChange={(e) => setUserSearch(e.target.value)} />
        {userSearch && (
          <select className={fieldClass} value={userId} onChange={(e) => setUserId(e.target.value)}>
            <option value="">Select customer…</option>
            {users?.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name ? `${u.name} ${u.surname ?? ""}` : u.email} — {u.email}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <div className="flex-1 space-y-1.5">
          <Label>Product</Label>
          <select className={fieldClass} value={productId} onChange={(e) => setProductId(e.target.value)}>
            <option value="">Select product…</option>
            {products?.filter((p) => p.price !== null).map((p) => (
              <option key={p.id} value={p.id}>{p.name} — {formatXAF(p.price)}</option>
            ))}
          </select>
        </div>
        <div className="w-20 space-y-1.5">
          <Label>Qty</Label>
          <input type="number" min="1" className={fieldClass} value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </div>
        <Button type="button" variant="outline" onClick={addLine}>Add line</Button>
      </div>

      {lines.length > 0 && (
        <ul className="space-y-1 text-sm">
          {lines.map((line, i) => {
            const product = products?.find((p) => p.id === line.productId);
            return (
              <li key={i} className="flex items-center justify-between rounded-lg bg-brand-input/40 px-3 py-1.5">
                <span>{product?.name ?? line.productId} × {line.quantity}</span>
                <button type="button" className="text-xs text-destructive" onClick={() => setLines(lines.filter((_, idx) => idx !== i))}>
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {createOrder.isError && <p className="text-sm text-destructive">{createOrder.error.message}</p>}

      <Button
        disabled={!userId || lines.length === 0 || createOrder.isPending}
        className="bg-brand-navy text-white hover:bg-brand-navy/90"
        onClick={() =>
          createOrder.mutate(
            { userId, items: lines, channel: "on_site" },
            { onSuccess: () => setLines([]) },
          )
        }
      >
        {createOrder.isPending ? "Recording…" : "Create order"}
      </Button>
    </div>
  );
}

function PaymentForm({ orderId }) {
  const recordPayment = useRecordPayment();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("cash");
  const [reference, setReference] = useState("");

  return (
    <div className="flex flex-wrap items-end gap-2 border-t border-border pt-3">
      <div className="w-32 space-y-1.5">
        <Label>Amount (XAF)</Label>
        <input type="number" min="1" className={fieldClass} value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label>Method</Label>
        <select className={fieldClass} value={method} onChange={(e) => setMethod(e.target.value)}>
          {PAYMENT_METHODS.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
      <div className="flex-1 space-y-1.5">
        <Label>Reference <span className="font-normal text-muted-foreground">(optional)</span></Label>
        <input className={fieldClass} value={reference} onChange={(e) => setReference(e.target.value)} />
      </div>
      <Button
        disabled={!amount || recordPayment.isPending}
        className="bg-brand-navy text-white hover:bg-brand-navy/90"
        onClick={() =>
          recordPayment.mutate(
            { id: orderId, amount: Number(amount), method, reference },
            { onSuccess: () => { setAmount(""); setReference(""); } },
          )
        }
      >
        {recordPayment.isPending ? "Recording…" : "Record payment"}
      </Button>
      {recordPayment.isError && <p className="w-full text-sm text-destructive">{recordPayment.error.message}</p>}
    </div>
  );
}

function OrderRow({ order }) {
  const updateStatus = useUpdateOrderStatus();
  const [isOpen, setIsOpen] = useState(false);
  const paidSoFar = order.payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="rounded-2xl border border-border bg-white shadow-sm">
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left">
        <div>
          <p className="font-medium text-brand-navy-dark">
            {order.user?.name ? `${order.user.name} ${order.user.surname ?? ""}` : order.user?.email} — {formatXAF(order.totalAmount)}
          </p>
          <p className="text-xs text-muted-foreground">
            {order.channel === "on_site" ? "On-site" : "Online"} · {order.items.length} item(s) · {formatDate(order.createdAt)}
          </p>
        </div>
        <span className="rounded-full bg-brand-input px-2.5 py-0.5 text-xs font-medium text-brand-navy-dark">{order.statusLabel}</span>
      </button>

      {isOpen && (
        <div className="space-y-4 border-t border-border px-4 py-4">
          <ul className="text-sm text-muted-foreground">
            {order.items.map((item) => (
              <li key={item.id}>{item.productName} × {item.quantity} — {formatXAF(item.unitPrice * item.quantity)}</li>
            ))}
          </ul>

          <p className="text-sm">
            Paid so far: <span className="font-medium text-brand-navy-dark">{formatXAF(paidSoFar)}</span> of {formatXAF(order.totalAmount)}
          </p>

          {order.receipt ? (
            <p className="text-sm text-brand-green">Receipt issued: {order.receipt.receiptNumber}</p>
          ) : (
            <PaymentForm orderId={order.id} />
          )}

          <div className="flex items-end gap-3 border-t border-border pt-3">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <select
                className={fieldClass}
                defaultValue={order.status}
                onChange={(e) => updateStatus.mutate({ id: order.id, status: e.target.value })}
              >
                {STATUS_OPTIONS.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
          {updateStatus.isError && (
            <p className="text-sm text-destructive">{updateStatus.error.message}</p>
          )}
        </div>
      )}
    </div>
  );
}

export function OrdersAdminView() {
  const { data: orders, isLoading, isError, error } = useAdminOrders();

  return (
    <div className="space-y-6">
      <OnSiteSaleForm />

      {isLoading && <p className="text-sm text-muted-foreground">Loading orders…</p>}
      {isError && <p className="text-sm text-destructive">{error.message}</p>}

      {!isLoading && !isError && (
        <div className="space-y-3">
          {orders?.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            orders?.map((order) => <OrderRow key={order.id} order={order} />)
          )}
        </div>
      )}
    </div>
  );
}
