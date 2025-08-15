"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import liff from "@line/liff";
import Loading from "@/components/StatusComponents/Loading";

const LiffContext = createContext({
  liffProfile: null,
  isLoggedIn: false,
  isLoading: true,
  lineAccessToken: "",
  // expose the raw liff (may be null in dev or before init)
  liff: null,
  // safe wrappers so your app won’t crash outside LIFF
  actions: {
    closeWindow: () => {},
    openWindow: (_url, _external) => {},
    text: () => {},
  },
});

const liffenvId = process.env.NEXT_PUBLIC_LIFF_ID;
const server = process.env.NEXT_PUBLIC_SERVER_OPTION; // "dev" | "prod" etc.

export function LiffProvider({ children }) {
  const [liffProfile, setLiffProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lineAccessToken, setLineAccessToken] = useState("");
  const [liffReady, setLiffReady] = useState(false);

  useEffect(() => {
    const longProfile = {
      userId: "U006fb519ba07650932c6981af95d0620",
      displayName: "Long👁️‍🗨️",
      pictureUrl:
        "https://profile.line-scdn.net/0hPsTql5LvD1x5CB7EtsVxYglYDDZaeVZOVjxHahgOUGhMPU9ZVDxIORwJAj5BOhxZAWxBakoIV21bTUB3DWgHYz9BU24mUxsKPhhEezdwJwJNQTdDFRZGXRB2BRAsbhxKUDFHXDVTUDIMbD5jU2oBcTpMFWpFQCxrN19jCnw6Yd8WCngJVG9GOE4BU2_M",
    };
    const thirdProfile = {
      userId: "U87dc3cebcbaecb31cf42e2efd55af2cc",
      displayName: "PINTO🍊",
      pictureUrl:
        "https://profile.line-scdn.net/0h33pF1d5RbBxdP30rE1ASYy1vb3Z-TjUOJV4kfWloNihoD35KIVklcmA9YHkwXysZJlogf2xqZShRLBt6Q2mQKFoPMS1hCSlIeFsg8g",
    };
    const testProfile = {
      userId: "U669f6092308023f227aa435c803b2e74",
      displayName: "Zzz59🧚🏻♀️🌈",
      pictureUrl:
        "https://lh3.googleusercontent.com/d/1eXgDln7TvPQGiMpzaUdo7l2hKmsh8Kvc",
    };

    const init = async () => {
      if (server === "dev") {
        // Dev mode: mock login/profile, mark as ready
        setIsLoggedIn(true);
        setLiffProfile(thirdProfile); // or longProfile
        setLineAccessToken("dev");
        setLiffReady(false); // no real LIFF in dev
        setIsLoading(false);
        return;
      }

      try {
        await liff.init({ liffId: liffenvId });
        setLiffReady(true);

        if (liff.isLoggedIn()) {
          setIsLoggedIn(true);
          const profile = await liff.getProfile();
          setLiffProfile(profile);
          setIsLoading(false);
          const accessToken = liff.getAccessToken();
          setLineAccessToken(accessToken || "");
        } else {
          liff.login(); // redirect into LINE
        }
      } catch (e) {
        console.error("[LIFF init error]", e);
      }
    };
    init();
  }, []);

  // Safe wrappers so components can call without worrying about environment
  const actions = {
    closeWindow: () => {
      try {
        if (server === "dev") {
          console.warn("[LIFF] closeWindow noop in dev");
          // As a dev fallback, just navigate away or no-op.
          return;
        }
        if (inClient()) {
          liff.closeWindow();
        } else {
          // Fallback when opened in external browser
          window.close();
        }
      } catch (e) {
        console.error("[LIFF closeWindow error]", e);
      }
    },
    openWindow: (url, external = false) => {
      try {
        if (server === "dev") {
          window.open(url, "_blank");
          return;
        }
        liff.openWindow({ url, external });
      } catch (e) {
        console.error("[LIFF openWindow error]", e);
      }
    },
    text: async (message) => {
      try {
        if (server === "dev") {
          console.warn("[LIFF] text noop in dev:", message);
          return { status: "dev-noop" };
        }
        if (!inClient()) {
          console.warn("[LIFF] text() works only inside LINE client chat.");
          return { status: "unsupported" };
        }
        if (!message || typeof message !== "string") {
          return {
            status: "error",
            error: "message must be a non-empty string",
          };
        }
        await liff.sendMessages([{ type: "text", text: message }]);
        return { status: "sent" };
      } catch (e) {
        console.error("[LIFF text error]", e);
        return { status: "error", error: e?.message };
      }
    },
  };

  if (isLoading) {
    return (
      <div className="gradient-background flex h-dvh w-full items-center justify-center">
        <Loading message={"liff init"} />
      </div>
    );
  }

  return (
    <LiffContext.Provider
      value={{
        liffProfile,
        isLoggedIn,
        isLoading,
        lineAccessToken,
        liff: liffReady ? liff : null,
        actions,
      }}
    >
      {children}
    </LiffContext.Provider>
  );
}

export const useLiff = () => useContext(LiffContext);
