import { ReceiptView } from "./ReceiptView";

export default async function ReceiptPage({ params }) {
  const { orderId } = await params;
  return <ReceiptView orderId={orderId} />;
}
