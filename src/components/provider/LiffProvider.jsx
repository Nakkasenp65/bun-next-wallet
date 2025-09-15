"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import liff from "@line/liff";
import Loading from "@/components/StatusComponents/Loading";
import toast from "react-hot-toast";

const LiffContext = createContext({
  liffProfile: null,
  isLoggedIn: false,
  isLoading: true,
  lineAccessToken: "",
  liff: null,
  actions: {},
  liffDecodedIdToken: null,
});

const liffenvId = process.env.NEXT_PUBLIC_LIFF_ID;
const server = process.env.NEXT_PUBLIC_SERVER_OPTION; // "dev" | "prod" etc.

export function LiffProvider({ children }) {
  const [liffProfile, setLiffProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lineAccessToken, setLineAccessToken] = useState("");
  const [liffReady, setLiffReady] = useState(false);
  const [liffDecodedIdToken, setLiffDecodedIdToken] = useState(null);

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
      pictureUrl: "https://lh3.googleusercontent.com/d/1eXgDln7TvPQGiMpzaUdo7l2hKmsh8Kvc",
    };
    const mockDecodedTokenId = {
      iss: "https://access.line.me",
      sub: "U006fb519ba07650932c6981af95d0620",
      aud: "2007338329",
      exp: 1757671690,
      iat: 1757668090,
      amr: ["linesso"],
      name: "Long👁️‍🗨️",
      picture:
        "https://profile.line-scdn.net/0hPsTqXG7qD1xpCB7EtsVwCxRNATEeJgkUEW0SPRxcV21AME0NBm8SMk9YUD8WPUpeBjpCOxwOUWpFJz0CKDZGfRV7GG5GWiNZVQU2Pg1zKRoqMTF1HC44PCtULzg4UB5eFWsfPSpxCm0acBx8PGhEewd-FShCOTBuNAw",
      email: "nakkasenwunthar@gmail.com",
    };

    const lineAccessTokenDev = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
    const init = async () => {
      if (server === "dev") {
        // Dev mode: mock login/profile, mark as ready
        setIsLoggedIn(true);
        setLiffProfile(longProfile); // or longProfile
        setLineAccessToken(lineAccessTokenDev);
        setLiffDecodedIdToken(mockDecodedTokenId);
        setLiffReady(true); // no real LIFF in dev
        setIsLoading(false);
        return;
      }

      try {
        await liff.init({ liffId: liffenvId });
        setLiffReady(true);

        if (liff.isLoggedIn()) {
          setIsLoggedIn(true);
          const decodedIdToken = liff.getDecodedIDToken();
          const profile = await liff.getProfile();
          setLiffProfile(profile);
          setLiffDecodedIdToken(decodedIdToken);
          const accessToken = liff.getAccessToken();
          console.log("Access token liff provider: ", accessToken);
          setLineAccessToken(accessToken || "");
          setIsLoading(false);
        } else {
          liff.login();
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
    shareTargetPicker: async (walletUniqueId, phoneNumber) => {
      if (server === "dev") {
        console.warn("[LIFF DEV] Simulating shareTargetPicker with payload:", {
          walletUniqueId,
          phoneNumber,
        });
        toast.success("แชร์ (จำลอง) สำเร็จ!");
        return; // จบการทำงานในโหมด dev
      }

      if (!liffReady || !liff.isLoggedIn()) {
        console.error(
          "[LIFF_ERROR] LIFF is not ready or user is not logged in for shareTargetPicker.",
        );
        toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับ LINE");
        return;
      }

      const flexMessagePayload = {
        type: "bubble",
        hero: {
          type: "image",
          url: "https://lh3.googleusercontent.com/d/1Ykf_Ph5JHrnWZRyXufzh4aiq_OlvYDP7",
          size: "full",
          action: {
            type: "uri",
            uri: "https://line.me/",
          },
          aspectMode: "cover",
          aspectRatio: "6:2",
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "กระเป๋า 1 Wallet ของฉัน 👜",
              weight: "bold",
              size: "lg",
            },
            {
              type: "box",
              layout: "vertical",
              margin: "lg",
              spacing: "sm",
              contents: [
                {
                  type: "box",
                  layout: "baseline",
                  spacing: "sm",
                  contents: [
                    {
                      type: "text",
                      text: "Wallet ID:",
                      color: "#aaaaaa",
                      size: "sm",
                      flex: 2,
                    },
                    {
                      type: "text",
                      text: `${walletUniqueId}`,
                      wrap: true,
                      color: "#666666",
                      size: "sm",
                      flex: 3,
                    },
                  ],
                },
                {
                  type: "box",
                  layout: "baseline",
                  spacing: "sm",
                  contents: [
                    {
                      type: "text",
                      text: "Phone:",
                      color: "#aaaaaa",
                      size: "sm",
                      flex: 2,
                    },
                    {
                      type: "text",
                      text: `${phoneNumber}`,
                      wrap: true,
                      color: "#666666",
                      size: "sm",
                      flex: 3,
                    },
                  ],
                },
              ],
            },
          ],
        },
      };

      try {
        const result = await liff.shareTargetPicker(flexMessagePayload, {
          isMultiple: true,
        });
        if (result) {
          console.log(`[LIFF_SUCCESS] Message sent with status:`, result.status);
          toast.success("แชร์ข้อความสำเร็จ!");
        } else {
          console.log("[LIFF_INFO] TargetPicker was closed by the user.");
          // ไม่จำเป็นต้องแจ้งเตือนผู้ใช้ในกรณีนี้
        }
      } catch (error) {
        // [CRITICAL FIX] บันทึก "error object" ทั้งหมดและแจ้งเตือนผู้ใช้
        console.error("[LIFF_FATAL_ERROR] shareTargetPicker failed:", error);
        toast.error(`การแชร์ล้มเหลว: ${error.message}`);
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
        liffDecodedIdToken,
      }}
    >
      {children}
    </LiffContext.Provider>
  );
}

export const useLiff = () => useContext(LiffContext);
