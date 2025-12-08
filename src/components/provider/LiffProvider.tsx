"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import liff from "@line/liff"; // Ensure you have @line/liff installed
import Loading from "@/components/StatusComponents/Loading";
import toast from "react-hot-toast";

// --- Types ---

export interface LiffProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export interface DecodedIdToken {
  iss?: string;
  sub?: string;
  aud?: string;
  exp?: number;
  iat?: number;
  amr?: string[];
  name?: string;
  picture?: string;
  email?: string;
  [key: string]: any;
}

export interface LiffActions {
  closeWindow: () => void;
  openWindow: (url: string, external?: boolean) => void;
  text: (message: string) => Promise<{ status: string; error?: string }>;
  shareTargetPicker: (
    walletUniqueId: string,
    phoneNumber: string,
  ) => Promise<void>;
}

export interface LiffContextProps {
  liffProfile: LiffProfile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  lineAccessToken: string;
  liff: typeof liff | null;
  actions: LiffActions;
  liffDecodedIdToken: DecodedIdToken | null;
}

// Default Context Value
const LiffContext = createContext<LiffContextProps>({
  liffProfile: null,
  isLoggedIn: false,
  isLoading: true,
  lineAccessToken: "",
  liff: null,
  actions: {
    closeWindow: () => {},
    openWindow: () => {},
    text: async () => ({ status: "error", error: "Not initialized" }),
    shareTargetPicker: async () => {},
  },
  liffDecodedIdToken: null,
});

const liffenvId = process.env.NEXT_PUBLIC_LIFF_ID || "";
const server = process.env.NEXT_PUBLIC_SERVER_OPTION; // "dev" | "prod" etc.

export function LiffProvider({ children }: { children: ReactNode }) {
  const [liffProfile, setLiffProfile] = useState<LiffProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lineAccessToken, setLineAccessToken] = useState<string>("");
  const [liffReady, setLiffReady] = useState<boolean>(false);
  const [liffDecodedIdToken, setLiffDecodedIdToken] =
    useState<DecodedIdToken | null>(null);

  // Helper to check if running in LINE Client
  const inClient = () => {
    // If liff is not ready or not loaded, we are likely not in client or in dev
    if (!liffReady && server === "dev") return false;
    try {
      return liff.isInClient();
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const longProfile: LiffProfile = {
      userId: "U006fb519ba07650932c6981af95d0620",
      displayName: "Long👁️‍🗨️",
      pictureUrl:
        "https://profile.line-scdn.net/0hPsTql5LvD1x5CB7EtsVxYglYDDZaeVZOVjxHahgOUGhMPU9ZVDxIORwJAj5BOhxZAWxBakoIV21bTUB3DWgHYz9BU24mUxsKPhhEezdwJwJNQTdDFRZGXRB2BRAsbhxKUDFHXDVTUDIMbD5jU2oBcTpMFWpFQCxrN19jCnw6Yd8WCngJVG9GOE4BU2_M",
    };

    const testProfile: LiffProfile = {
      userId: "U669f6092308023f227aa435c803b2e74",
      displayName: "Zzz59🧚🏻♀️🌈",
      pictureUrl:
        "https://lh3.googleusercontent.com/d/1eXgDln7TvPQGiMpzaUdo7l2hKmsh8Kvc",
    };

    const mockDecodedTokenId: DecodedIdToken = {
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

    const lineAccessTokenDev = process.env.NEXT_PUBLIC_ACCESS_TOKEN || "";

    const init = async () => {
      if (server === "dev") {
        // Dev mode: mock login/profile, mark as ready
        setIsLoggedIn(true);
        setLiffProfile(longProfile);
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
          
          // Optimization: Use ID Token for immediate rendering
          if (decodedIdToken && decodedIdToken.sub) {
             const immediateProfile: LiffProfile = {
                userId: decodedIdToken.sub,
                displayName: decodedIdToken.name || "User",
                pictureUrl: decodedIdToken.picture,
             };
             setLiffProfile(immediateProfile);
             setLiffDecodedIdToken(decodedIdToken);
          }

          const accessToken = liff.getAccessToken();
          console.log("Access token liff provider: ", accessToken);
          setLineAccessToken(accessToken || "");
          
          // Unblock UI immediately
          setIsLoading(false);

          // Background update (optional, facilitates ensuring latest data)
          liff.getProfile().then((profile) => {
             setLiffProfile(profile);
          }).catch(err => console.error("Background profile fetch failed", err));

        } else {
          liff.login();
        }
      } catch (e) {
        console.error("[LIFF init error]", e);
        // Even on error, we stop loading to prevent infinite spinner
        setIsLoading(false);
      }
    };

    init();
  }, []);

  // Safe wrappers so components can call without worrying about environment
  const actions: LiffActions = {
    closeWindow: () => {
      try {
        if (server === "dev") {
          console.warn("[LIFF] closeWindow noop in dev");
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
    openWindow: (url: string, external: boolean = false) => {
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
    text: async (message: string) => {
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
      } catch (e: any) {
        console.error("[LIFF text error]", e);
        return { status: "error", error: e?.message };
      }
    },
    shareTargetPicker: async (walletUniqueId: string, phoneNumber: string) => {
      if (server === "dev") {
        console.warn("[LIFF DEV] Simulating shareTargetPicker with payload:", {
          walletUniqueId,
          phoneNumber,
        });
        toast.success("แชร์ (จำลอง) สำเร็จ!");
        return;
      }

      if (!liffReady || !liff.isLoggedIn()) {
        console.error(
          "[LIFF_ERROR] LIFF is not ready or user is not logged in for shareTargetPicker.",
        );
        toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับ LINE");
        return;
      }

      // Note: This matches the structure of a Flex Bubble Container.
      // To send it, it usually needs to be wrapped in a Flex Message,
      // but shareTargetPicker is flexible. We treat it as 'any' to satisfy TS.
      const flexMessagePayload: any = {
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
        // Technically, shareTargetPicker expects Message[], but it also accepts Flex Container objects in some versions/implementations.
        // We wrap it in an array to be safe and compatible with standard Message[] type.
        // However, since flexMessagePayload is a 'bubble' (Container), and not a 'flex' (Message),
        // we construct the valid Flex Message wrapper here:
        const messageToSend = {
          type: "flex",
          altText: "ข้อมูล Wallet ของฉัน",
          contents: flexMessagePayload,
        };

        const result = await liff.shareTargetPicker([messageToSend as any], {
          isMultiple: true,
        });

        if (result) {
          console.log(
            `[LIFF_SUCCESS] Message sent with status:`,
            result.status,
          );
          toast.success("แชร์ข้อความสำเร็จ!");
        } else {
          console.log("[LIFF_INFO] TargetPicker was closed by the user.");
        }
      } catch (error: any) {
        console.error("[LIFF_FATAL_ERROR] shareTargetPicker failed:", error);
        toast.error(`การแชร์ล้มเหลว: ${error.message}`);
      }
    },
  };

  if (isLoading) {
    return (
      <div className="gradient-background flex h-dvh w-full items-center justify-center">
        <Loading message={"กำลังเริ่มต้น LIFF"} />
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
