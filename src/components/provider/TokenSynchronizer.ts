"use client";
import { useEffect } from "react";
import { useLiff } from "./LiffProvider";
import { setAuthToken } from "@/lib/tokenManager";

export default function TokenSynchronizer() {
  const { lineAccessToken }: { lineAccessToken: string | undefined } =
    useLiff();

  useEffect(() => {
    if (lineAccessToken) {
      setAuthToken(lineAccessToken);
    }
  }, [lineAccessToken]);

  return null;
}
