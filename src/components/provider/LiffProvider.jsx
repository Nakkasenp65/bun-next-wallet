"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import liff from "@line/liff";
import Loading from "@/components/StatusComponents/Loading";

const LiffContext = createContext({
  liffProfile: null,
  isLoggedIn: false,
  isLoading: true,
});

const liffenvId = process.env.NEXT_PUBLIC_LIFF_ID;
const server = process.env.NEXT_PUBLIC_SERVER_OPTION;

export function LiffProvider({ children }) {
  const [liffProfile, setLiffProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lineAccessToken, setLineAccessToken] = useState("");

  useEffect(() => {
    const longProfile = {
      userId: "U006fb519ba07650932c6981af95d0620",
      displayName: "Long👁️‍🗨️",
      pictureUrl:
        "https://profile.line-scdn.net/0hPsTql5LvD1x5CB7EtsVxYglYDDZaeVZOVjxHahgOUGhMPU9ZVDxIORwJAj5BOhxZAWxBakoIV21bTUB3DWgHYz9BU24mUxsKPhhEezdwJwJNQTdDFRZGXRB2BRAsbhxKUDFHXDVTUDIMbD5jU2oBcTpMFWpFQCxrN19jCnw6Yd8WCngJVG9GOE4BU2_M",
    };
    const testProfile = {
      userId: "U669f6092308023f227aa435c803b2e74",
      displayName: "Zzz59🧚🏻♀️🌈",
      pictureUrl:
        "https://lh3.googleusercontent.com/d/1eXgDln7TvPQGiMpzaUdo7l2hKmsh8Kvc",
    };
    const initialize = async () => {
      if (server === "dev") {
        setLiffProfile(longProfile);
        setIsLoggedIn(true);
        setLineAccessToken("dev");
        setIsLoading(false);
      } else {
        try {
          await liff.init({ liffId: liffenvId });
          if (liff.isLoggedIn()) {
            setIsLoggedIn(true);
            const profile = await liff.getProfile();
            setLiffProfile(profile);
            const accessToken = liff.getAccessToken();
            setLineAccessToken(accessToken);
          } else {
            liff.login();
          }
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      }
    };
    initialize();
  }, []);

  if (isLoading) {
    return (
      <div className="gradient-background flex h-dvh w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <LiffContext.Provider
      value={{ liffProfile, isLoggedIn, isLoading, lineAccessToken }}
    >
      {children}
    </LiffContext.Provider>
  );
}

export const useLiff = () => useContext(LiffContext);
