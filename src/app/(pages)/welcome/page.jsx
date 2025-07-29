"use client";

import CtaButton from "@/components/Ui/CtaButton";
import React, { useEffect, useState } from "react";
import SetupContent from "@/components/Ui/SetupContent";
import { useUserStatus } from "@/hooks/useUserStatus";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import ErrorComponent from "@/components/Ui/ErrorComponent";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLiff } from "@/components/provider/LiffProvider";
import toast from "react-hot-toast";

const createGoal = async ({ userId, goalData }) => {
  const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/goal/${userId}`, goalData);
  return data;
};

const createUser = async ({ liffId, displayName, pictureUrl }) => {
  const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
    liffId: liffId,
    username: displayName,
    userProfilePicUrl: pictureUrl,
  });
  return data;
};

export default function Page() {
  const { liffProfile } = useLiff();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [goal, setGoal] = useState({});
  const [onWait, setOnWait] = useState(true);
  const liffId = liffProfile?.userId;
  const { data: userStatus, isLoading: isStatusLoading, error: statusError } = useUserStatus(liffId);
  const { data: userData } = useUser(liffId);

  const createGoalMutation = useMutation({
    mutationFn: createGoal,
    onSuccess: async () => {
      try {
        await queryClient.invalidateQueries({ queryKey: ["user", liffId] });
        await queryClient.invalidateQueries({ queryKey: ["userStatus", liffId] });
        toast.success("สร้างเป้าหมายการออมเงินสำเร็จ!");
        router.push("/");
      } catch (error) {
        setOnWait(false);
        console.error("Failed to refetch data after goal creation:", error);
        toast.error("ไม่สามารถโหลดข้อมูลล่าสุดได้ โปรดลองอีกครั้ง");
      }
    },
    onError: (err) => {
      setOnWait(false);
      console.error("Error creating goal:", err);
      toast.error("สร้างเป้าหมายการออมเงินไม่สำเร็จ");
    },
  });

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user", liffId] });
      await queryClient.invalidateQueries({ queryKey: ["userStatus", liffId] });
    },
    onError: (err) => {
      console.error("Error creating user:", err);
      toast.error("เกิดข้อผิดพลาดในการสร้างบัญชีผู้ใช้");
    },
  });

  const handleSetGoal = () => {
    if (!goal.mobileId || !goal.planId || !userData?.id) return;
    setOnWait(true);
    const goalData = { mobileId: goal.mobileId, planId: goal.planId };
    createGoalMutation.mutate({ userId: userData.id, goalData });
  };

  useEffect(() => {
    if (!userStatus) return;

    if (!userStatus.isNewUser && !userStatus.firstTime) {
      router.push("/");
      return;
    }

    if (userStatus.isNewUser && liffProfile && createUserMutation.isIdle) {
      createUserMutation.mutate({
        liffId: liffProfile.userId,
        displayName: liffProfile.displayName,
        pictureUrl: liffProfile.pictureUrl,
      });
    }
    setOnWait(false);
  }, [userStatus, liffProfile, router, createUserMutation]);

  if (isStatusLoading || createUserMutation.isPending || onWait) {
    return (
      <div className="bg-bg-dark flex h-dvh w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (statusError) {
    return <ErrorComponent message={statusError.message} />;
  }

  if (!onWait)
    return (
      <main id="setup-page" className="flex min-h-dvh flex-col bg-white">
        <header className="from-primary-pink to-primary-orange flex flex-col items-center justify-center gap-2 rounded-b-4xl bg-gradient-to-br p-6 pt-14 text-white drop-shadow-lg">
          <h1 className="text-2xl font-bold text-white drop-shadow-md drop-shadow-black/30">ตั้งค่าเป้าหมายการออม</h1>
          <p className="text-xs">เลือกสิ่งที่คุณอยากได้ แล้วมาเริ่มวางแผนการออมกัน!</p>
        </header>

        <SetupContent goal={goal} setGoal={setGoal} />

        <footer className="w-full bg-white p-6 pb-12 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
          <CtaButton onClick={handleSetGoal} disabled={createGoalMutation.isPending || !goal.planId || !goal.mobileId}>
            {createGoalMutation.isPending ? "กำลังบันทึก..." : "เริ่มต้นการออม"}
          </CtaButton>
        </footer>
      </main>
    );
}
