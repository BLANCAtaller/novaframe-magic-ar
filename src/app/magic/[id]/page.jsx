import React from "react";
import { MAGIC_REGISTRY } from "@/config/magic-registry";
import MagicClient from "./MagicClient";

export function generateStaticParams() {
  return Object.keys(MAGIC_REGISTRY).map((id) => ({
    id: id,
  }));
}

export const dynamicParams = false;

export default async function MagicDynamicPage({ params }) {
  const { id } = await params;
  
  return <MagicClient id={id} />;
}
