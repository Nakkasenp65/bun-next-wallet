"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import jsQR from "jsqr";
import { useUser } from "@/hooks/useUser";
import dynamic from "next/dynamic";
import { FaImages } from "react-icons/fa";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";

const TransferPage = dynamic(() => import("@/components/pages/TransferPage"), {
  ssr: false,
});

// --- Helpers ---
const isValidLineUserId = (s) => /^U[a-f0-9]{32}$/i.test(String(s).trim());

export default function Page() {
  const router = useRouter();
  const params = useParams();

  // Sender (current user) from route
  const myUserId = Array.isArray(params?.userId)
    ? params.userId[0]
    : params?.userId || "";
  const { data: myUserData } = useUser?.(myUserId || "") ?? { data: null };

  // Recipient (scanned from QR)
  const [scannedUserId, setScannedUserId] = useState("");
  const { data: scannedUser } = useUser?.(scannedUserId || "") ?? {
    data: null,
  };

  // Scanner refs/state
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const canvasRef = useRef(null);

  const [facing, setFacing] = useState("environment");
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState("");
  const [showTransfer, setShowTransfer] = useState(false);

  const lastHitRef = useRef(0);
  const scanDelayMs = 3000; // throttle decoding
  const isNavigatingAway = useRef(false);

  useEffect(() => {
    canvasRef.current = document.createElement("canvas");
    startCamera(facing);
    return () => stopCamera();
  }, []);

  async function startCamera(mode = facing) {
    try {
      stopCamera();
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Camera not available in this browser.");
        return;
      }
      const constraints = {
        audio: false,
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      const video = videoRef.current;
      video.srcObject = stream;
      video.muted = true;
      await video.play();

      setIsScanning(true);
      setError("");
      loop();
    } catch (e) {
      // fallback to front camera if back not available
      if (mode === "environment") {
        setFacing("user");
        startCamera("user");
      } else {
        setError(e?.message || "Failed to start camera");
      }
    }
  }

  function stopCamera() {
    cancelAnimationFrame(rafRef.current);
    setIsScanning(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }

  function handleParentClose() {
    isNavigatingAway.current = true;
    router.replace("/");
  }

  function loop() {
    const video = videoRef.current;
    rafRef.current = requestAnimationFrame(loop);
    if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    const canvas = canvasRef.current;
    const w = video.videoWidth;
    const h = video.videoHeight;
    if (!w || !h) return;

    const ctx = canvas.getContext("2d");
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(video, 0, 0, w, h);
    const img = ctx.getImageData(0, 0, w, h);
    const code = jsQR(img.data, img.width, img.height, {
      inversionAttempts: "dontInvert",
    });

    if (!code) return;

    const now = Date.now();
    if (now - lastHitRef.current <= scanDelayMs) return;
    lastHitRef.current = now;

    const uid = String(code.data || "").trim();

    if (isValidLineUserId(uid)) {
      setScannedUserId(uid);
      setShowTransfer(true);
      stopCamera();
      try {
        navigator.vibrate?.(60);
      } catch {}
      setError("");
    } else {
      // Live-scan invalid QR (not LINE user id)
      setError("QR ไม่ถูกต้อง (ต้องเป็น LINE user ID เช่น U006fb5…)");
      try {
        navigator.vibrate?.([90, 60, 90]);
      } catch {}
    }
  }

  async function decodeFile(file) {
    if (!file) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    try {
      const bitmap = await createImageBitmap(file);
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      ctx.drawImage(bitmap, 0, 0);
      const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(img.data, img.width, img.height, {
        inversionAttempts: "dontInvert",
      });

      if (!code) {
        setError("ไม่พบ QR ในรูปภาพ");
        try {
          navigator.vibrate?.([60, 40, 60]);
        } catch {}
        return;
      }

      const uid = String(code.data || "").trim();

      if (isValidLineUserId(uid)) {
        setScannedUserId(uid);
        setShowTransfer(true);
        stopCamera();
        try {
          navigator.vibrate?.(60);
        } catch {}
        setError("");
      } else {
        // *** Requested behavior: prompt when image QR is NOT a LINE user id ***
        setError("QR Code ในรูปภาพไม่ถูกต้อง (ต้องเป็น LINE user ID)");
        // Simple prompt/alert for clarity
        alert(
          "รูปภาพนี้มี QR Code แต่ไม่ได้อยู่ในรูปแบบ LINE user ID (เช่น U006fb519ba07650932c6981af95d0620)\nกรุณาเลือกรูปใหม่หรือสแกน QR ที่ถูกต้อง",
        );
        try {
          navigator.vibrate?.([90, 60, 90]);
        } catch {}
      }
    } catch {
      setError("ไม่สามารถอ่านรูปภาพได้");
    }
  }

  return (
    <div className="flex min-h-screen w-screen flex-col items-start justify-center">
      {/* Top bar */}
      <div className="bg-bg-dark sticky top-0 z-10 w-full self-center backdrop-blur">
        <header className="flex items-center px-5 pt-10 pb-4">
          {/* ✅ FIX: Use the dedicated cancel handler */}
          <Link href={"/"} className="text-secondary-text text-2xl">
            <IoIosArrowBack className="text-3xl" />
          </Link>
          <h2 className="from-primary-pink to-primary-orange flex-grow bg-gradient-to-r bg-clip-text text-center text-xl font-bold text-transparent">
            แสกนโอนเงิน
          </h2>
          <div className="w-6" />
        </header>
      </div>

      {/* Scanner section */}
      {!showTransfer && (
        <div className="flex w-full max-w-xl flex-grow flex-col gap-4 rounded-t-4xl bg-white p-8">
          <div className="drop-shadow-primary-pink/50 relative aspect-[3/4] overflow-hidden rounded-2xl bg-black drop-shadow-xl">
            {/* Camera feed */}
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              playsInline
              autoPlay
              muted
            />

            {/* Reticle mask */}
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="h-40 w-40 rounded-xl border-2 border-white/80 shadow-[0_0_0_100vmax_rgba(0,0,0,.35)] outline outline-white/20"></div>
            </div>

            {/* Single photo icon (choose from gallery) */}
            <label
              className="absolute right-3 bottom-3 z-10 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/95 shadow-md hover:bg-white"
              title="เลือกจากรูปภาพ"
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => decodeFile(e.target.files?.[0])}
              />
              {/* Photo/gallery icon */}
              <FaImages className="text-primary-pink" size={24} />
            </label>

            {/* Status bar */}
            <div className="absolute right-2 bottom-2 left-2 rounded bg-black/30 px-2 py-1 text-xs text-white/90">
              {isScanning ? "กำลังสแกน…" : "Camera idle"}
              {error && ` • ${error}`}
            </div>
          </div>
        </div>
      )}

      {/* Transfer overlay */}
      {myUserData && (
        <TransferPage
          userData={myUserData}
          showTransfer={showTransfer}
          setShowTransfer={(v) => {
            setShowTransfer(v);
            if (!v && !isNavigatingAway.current) {
              setTimeout(() => startCamera(facing), 300);
            }
          }}
          receiverData={scannedUser}
          setParentClose={handleParentClose}
        />
      )}
    </div>
  );
}
