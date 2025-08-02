"use client";
import { useEffect } from "react";
import { useLiff } from "./LiffProvider";
import { setAuthToken } from "@/lib/tokenManager";

export default function TokenSynchronizer() {
  const { accessToken } = useLiff();

  useEffect(() => {
    if (accessToken) {
      console.log(
        "TokenSynchronizer: New access token received from LIFF. Updating token manager.",
      );
      setAuthToken(accessToken);
    }
  }, [accessToken]);

  return null;
}
