'use client';

import { Suspense } from "react";
import OrderConfirmation from "../order/OrderConfirmation";

export default function OrderConfirmationPage() {
  return <Suspense><OrderConfirmation /></Suspense>;
}
