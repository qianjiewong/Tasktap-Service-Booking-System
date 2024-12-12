"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import Checkout from "./_components/Checkout";


export default function Page() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <Checkout />
    </Suspense>
  );
}
