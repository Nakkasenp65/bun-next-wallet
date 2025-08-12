"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import jsQR from "jsqr";
import { useUser } from "@/hooks/useUser";
import dynamic from "next/dynamic";
import { Router } from "next/router";

const TransferPage = dynamic(() => import("@/components/pages/TransferPage"), {
  ssr: false,
});

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
  const { data: scannedUser, isLoading: scannedLoading } = useUser?.(
    scannedUserId || "",
  ) ?? { data: null };

  // Scanner refs/state
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const canvasRef = useRef(null);
  const [facing, setFacing] = useState("environment");
  const [isScanning, setIsScanning] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [lastResult, setLastResult] = useState("");
  const [error, setError] = useState("");
  const [showTransfer, setShowTransfer] = useState(false);
  const lastHitRef = useRef(0);
  const scanDelayMs = 3000;
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

      if (torchOn) await setTorch(true);

      setIsScanning(true);
      setError("");
      loop();
    } catch (e) {
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

  async function setTorch(on) {
    try {
      const track = streamRef.current?.getVideoTracks?.()[0];
      if (!track) return false;
      const caps = track.getCapabilities?.();
      if (!caps || !caps.torch) return false;
      await track.applyConstraints({ advanced: [{ torch: !!on }] });
      setTorchOn(!!on);
      return true;
    } catch {
      return false;
    }
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

    if (code) {
      const now = Date.now();
      if (now - lastHitRef.current > scanDelayMs) {
        lastHitRef.current = now;
        const uid = String(code.data || "").trim();

        if (uid && uid.length >= 6) {
          setLastResult(uid);
          setScannedUserId(uid);

          // Open transfer; camera can stop to save battery
          setShowTransfer(true);
          stopCamera();

          try {
            navigator.vibrate?.(60);
          } catch {}
        }
      }
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
      if (code) {
        const uid = String(code.data || "").trim();
        setLastResult(uid);
        setScannedUserId(uid);
        setShowTransfer(true);
        stopCamera();
        try {
          navigator.vibrate?.(60);
        } catch {}
      } else {
        setLastResult("No QR found in image.");
      }
    } catch {
      setLastResult("Failed to read image.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-xl items-center gap-3 p-3">
          <button
            onClick={() => router.push("/")}
            className="text-bg-dark rounded-xl p-2 hover:bg-gray-100"
            aria-label="Back"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h1 className="text-lg font-semibold">Scan QR</h1>
          <div className="ml-auto text-xs text-gray-500">
            {myUserData?.name ?? ""}
          </div>
        </div>
      </div>

      {/* Scanner section */}
      {!showTransfer && (
        <div className="mx-auto flex max-w-xl flex-col gap-4 p-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-black">
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              playsInline
              autoPlay
              muted
            />
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="h-40 w-40 rounded-xl border-2 border-white/80 shadow-[0_0_0_100vmax_rgba(0,0,0,.35)] outline outline-2 outline-white/20"></div>
            </div>
            <div className="absolute right-2 bottom-2 left-2 rounded bg-black/30 px-2 py-1 text-xs text-white/90">
              {isScanning ? "Scanning…" : "Camera idle"}
              {error && ` • ${error}`}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => (isScanning ? stopCamera() : startCamera(facing))}
              className="text-bg-dark rounded-xl border bg-white px-3 py-2"
            >
              {isScanning ? "Stop" : "Start"} camera
            </button>
            <button
              onClick={() => {
                const next = facing === "environment" ? "user" : "environment";
                setFacing(next);
                startCamera(next);
              }}
              className="text-bg-dark rounded-xl border bg-white px-3 py-2"
            >
              Flip camera
            </button>
            <button
              onClick={async () => {
                const ok = await setTorch(!torchOn);
                if (!ok) alert("Torch not supported on this device/browser.");
              }}
              className="text-bg-dark rounded-xl border bg-white px-3 py-2"
            >
              {torchOn ? "Torch off" : "Torch on"}
            </button>

            <label className="text-bg-dark cursor-pointer rounded-xl border bg-white px-3 py-2 text-center">
              Choose photo
              <input
                type="file"
                accept="image/*"
                className="text-bg-dark hidden"
                onChange={(e) => decodeFile(e.target.files?.[0])}
              />
            </label>
          </div>

          <div className="rounded-2xl border bg-white p-3">
            <div className="mb-1 text-xs text-gray-500">Scanned userId</div>
            <pre className="text-bg-dark text-sm break-words whitespace-pre-wrap">
              {lastResult || "—"}
            </pre>
            {scannedUserId && (
              <div className="mt-2 text-xs text-gray-500">
                {scannedLoading
                  ? "Loading recipient…"
                  : scannedUser
                    ? `Recipient: ${scannedUser?.line_display_name ?? scannedUser?.username ?? scannedUser?.name ?? scannedUser?.id}`
                    : "Recipient not found"}
              </div>
            )}
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
