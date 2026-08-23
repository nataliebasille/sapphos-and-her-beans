import { ReceiptConfirmation } from "../_components/receipt-confirmation";
import { loadCompletedOrder } from "../_components/completed-order-storage";
import { getCheckoutReceipt } from "~/server/checkout/get_checkout_receipt";

type CheckoutReceiptPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CheckoutReceiptPage({
  params,
}: CheckoutReceiptPageProps) {
  const { id } = await params;
  const completedOrder = await loadCompletedOrder();
  const order =
    completedOrder?.checkoutSessionId === id ? completedOrder : null;
  const receipt = order ? null : await getCheckoutReceipt(id);

  return (
    <div className="bg-surface-50 -mt-[calc(89px+1.5rem)] min-h-dvh w-full pt-[89px]">
      <ReceiptConfirmation order={order} receipt={receipt} />
    </div>
  );
}
