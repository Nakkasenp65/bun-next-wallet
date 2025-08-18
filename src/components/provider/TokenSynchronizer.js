"use client";
import { useEffect } from "react";
import { useLiff } from "./LiffProvider";
import { setAuthToken } from "@/lib/tokenManager";

export default function TokenSynchronizer() {
  const { lineAccessToken } = useLiff();
  console.log("access token: ", lineAccessToken);

  useEffect(() => {
    if (lineAccessToken) {
      console.log(
        "TokenSynchronizer: New access token received from LIFF. Updating token manager.",
      );
      setAuthToken(lineAccessToken);
    }
  }, [lineAccessToken]);

  return null;
}
