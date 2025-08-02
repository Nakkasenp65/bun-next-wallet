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
    const initialize = async () => {
      if (server === "dev") {
        setLiffProfile({
          userId: "U5d2998909721fdea596f8e9e91e7bf85",
          displayName: "Long👁️‍🗨️",
          pictureUrl:
            "https://profile.line-scdn.net/0hPsTqIBJhD1x5CB7EtsVxYglYDDZaeVZOVjxHahgOUGhMPU9ZVDxIORwJAj5BOhxZAWxBakoIV21bTUB3DWgHYz9BU24mUxsKPhhEezdwJwJNQTdDFRZGXRB2BRAsbhxKUDFHXDVTUDIMbD5jU2oBcTpMFWpFQCxrN19jCnw6Yd8WCngJVG9EPUQAVmrA",
        });
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
    <LiffContext.Provider value={{ liffProfile, isLoggedIn, isLoading, lineAccessToken }}>
      {children}
    </LiffContext.Provider>
  );
}

export const useLiff = () => useContext(LiffContext);
