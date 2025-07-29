"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import liff from "@line/liff";
import Loading from "@/components/Loading";
import CtaButton from "@/components/Ui/CtaButton";

const LiffContext = createContext({
  liffProfile: null,
  isLoggedIn: false,
  isLoading: true,
});

const liffenvId = process.env.NEXT_PUBLIC_LIFF_ID;

export function LiffProvider({ children }) {
  const [liffProfile, setLiffProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        await liff.init({ liffId: liffenvId });
        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          setIsLoggedIn(true);
          setLiffProfile(profile);
        } else {
          liff.login();
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    initialize();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-bg-dark flex h-dvh w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  return <LiffContext.Provider value={{ liffProfile, isLoggedIn, isLoading }}>{children}</LiffContext.Provider>;
}

export const useLiff = () => useContext(LiffContext);
