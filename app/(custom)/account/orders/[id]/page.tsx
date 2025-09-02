import OrderDetails from "./OrderDetails";
import { Suspense } from "react";

export default function OrderDetailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderDetails/>
    </Suspense>
  );
}