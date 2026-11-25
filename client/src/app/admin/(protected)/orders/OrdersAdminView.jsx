"use client";

import { useState } from "react";
import { useAdminOrders, useCreateAdminOrder, useUpdateOrderStatus, useRecordPayment } from "@/hooks/useOrders";
import { useAdminProducts } from "@/hooks/useProducts";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { formatXAF } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ListToolbar, matchRows, SaveStatus, EmptyList } from "@/components/admin/AdminTable";

const TABS = [
  { label: "Awaiting payment", statuses: ["pending_payment"] },
  { label: "In progress", statuses: ["paid", "processing", "ready"] },
  { label: "Completed", statuses: ["completed"] },
  { label: "Cancelled", statuses: ["cancelled", "payment_failed"] },
  { label: "All" },
];

const STATUS_STYLE = {
  pending_payment: "border-amber-200 bg-amber-50 text-amber-700",
  paid: "border-blue-200 bg-blue-50 text-blue-700",
  processing: "border-sky-200 bg-sky-50 text-sky-700",
  ready: "border-indigo-200 bg-indigo-50 text-indigo-700",
  completed: "border-green-200 bg-green-50 text-green-700",
  cancelled: "border-gray-200 bg-gray-100 text-gray-500",
  payment_failed: "border-red-200 bg-red-50 text-red-700",
};

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

function OnSiteSaleForm({ onDone }) {
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

      <div className="flex gap-2">
        <Button
          disabled={!userId || lines.length === 0 || createOrder.isPending}
          className="bg-brand-navy text-white hover:bg-brand-navy/90"
          onClick={() => createOrder.mutate({ userId, items: lines, channel: "on_site" }, { onSuccess: onDone })}
        >
          {createOrder.isPending ? "Recording…" : "Create order"}
        </Button>
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
      </div>
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
      <div className="w-full">
        <SaveStatus mutation={recordPayment} />
      </div>
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
        <span
          className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[order.status] ?? STATUS_STYLE.cancelled}`}
        >
          {order.statusLabel}
        </span>
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
            <div className="pb-2">
              <SaveStatus mutation={updateStatus} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function OrdersAdminView() {
  const { data: orders, isLoading, isError, error } = useAdminOrders();
  const [tab, setTab] = useState(TABS[0]);
  const [search, setSearch] = useState("");
  const [showSaleForm, setShowSaleForm] = useState(false);

  const shown = matchRows(orders, tab, search, (o) => [
    o.user?.name,
    o.user?.surname,
    o.user?.email,
    o.receipt?.receiptNumber,
    ...o.items.map((item) => item.productName),
  ]);

  return (
    <div className="space-y-4">
      {showSaleForm ? (
        <OnSiteSaleForm onDone={() => setShowSaleForm(false)} />
      ) : (
        <Button className="bg-brand-navy text-white hover:bg-brand-navy/90" onClick={() => setShowSaleForm(true)}>
          + Record on-site sale
        </Button>
      )}

      {isLoading && <p className="text-sm text-muted-foreground">Loading orders…</p>}
      {isError && <p className="text-sm text-destructive">{error.message}</p>}

      {!isLoading && !isError && (
        <>
          <ListToolbar
            tabs={TABS}
            tab={tab}
            onTab={setTab}
            rows={orders}
            search={search}
            onSearch={setSearch}
            placeholder="Search customer, product, receipt no…"
          />
          {shown.length ? (
            <div className="space-y-3">
              {shown.map((order) => <OrderRow key={order.id} order={order} />)}
            </div>
          ) : (
            <EmptyList>{search ? "No orders match your search." : `No orders in “${tab.label}”.`}</EmptyList>
          )}
        </>
      )}
    </div>
  );
}
