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
          setIsLoggedIn(true);
          const profile = await liff.getProfile();
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

  // const login = () => {
  //   liff.login();
  // };

  if (isLoading) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-bg-dark">
        <Loading />
      </div>
    );
  }

  // If not logged in, show a login button. This might appear on pages other than /welcome if accessed directly.
  // if (!isLoggedIn) {
  //   return (
  //     <div className="flex h-dvh w-full flex-col items-center justify-center bg-bg-dark p-8 text-center">
  //       <h1 className="text-2xl font-bold text-white">Welcome to 1Wallet</h1>
  //       <div className="mt-8 w-full max-w-xs">
  //         <CtaButton onClick={login}>Login with LINE</CtaButton>
  //       </div>
  //     </div>
  //   );
  // }

  return <LiffContext.Provider value={{ liffProfile, isLoggedIn, isLoading }}>{children}</LiffContext.Provider>;
}

export const useLiff = () => useContext(LiffContext);
