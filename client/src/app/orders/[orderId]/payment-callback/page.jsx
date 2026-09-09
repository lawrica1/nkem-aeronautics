import { PaymentCallbackView } from "./PaymentCallbackView";

export default async function PaymentCallbackPage({ params, searchParams }) {
  const { orderId } = await params;
  const { transaction_id, status } = await searchParams;
  return <PaymentCallbackView orderId={orderId} transactionId={transaction_id} redirectStatus={status} />;
}
