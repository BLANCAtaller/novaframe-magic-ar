"use client";

import dynamic from "next/dynamic";

const MagicScanner = dynamic(() => import("@/components/MagicScanner"), { ssr: false });


export default function MagicPage() {
  return <MagicScanner />;
}
