"use client";

import dynamic from "next/dynamic";

const MagicScanner = dynamic(() => import("@/components/MagicScanner"), { ssr: false });

export default function MagicClient({ id }) {
  return (
    <div className="w-full h-full bg-black">
      <MagicScanner id={id} />
    </div>
  );
}
