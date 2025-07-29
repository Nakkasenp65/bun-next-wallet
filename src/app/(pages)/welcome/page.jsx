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

// Helper functions remain the same
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

// Page
export default function Page() {
  const { liffProfile } = useLiff();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [goal, setGoal] = useState({});
  const liffId = liffProfile?.userId;

  const { data: userStatus, isLoading: isStatusLoading, error: statusError } = useUserStatus(liffId);
  const { data: userData } = useUser(liffId);

  const goalMutation = useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", liffId] });
      queryClient.invalidateQueries({ queryKey: ["userStatus", liffId] });
      toast.success("สร้างเป้าหมายการออมสำเร็จ!");
      router.push("/");
    },
    onError: (err) => {
      console.error("Failed to set goal:", err);
    },
  });

  const handleSetGoal = () => {
    console.log("test");
    if (!goal.mobileId || !goal.planId || !userData?.id) return;
    const goalData = { mobileId: goal.mobileId, planId: goal.planId };
    goalMutation.mutate({ userId: userData.id, goalData });
  };

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", liffId] });
      queryClient.invalidateQueries({ queryKey: ["userStatus", liffId] });
    },
  });

  useEffect(() => {
    if (!userStatus) {
      return;
    }

    if (!userStatus.isNewUser && !userStatus.firstTime) {
      router.push("/");
      return;
    }

    if (userStatus.isNewUser && liffProfile && createUserMutation.isIdle) {
      console.log("is new user");

      createUserMutation.mutate({
        liffId: liffProfile.userId,
        displayName: liffProfile.displayName,
        pictureUrl: liffProfile.pictureUrl,
      });
    }
  }, [userStatus, router]);

  if (isStatusLoading) {
    return (
      <div className="bg-bg-dark flex h-dvh w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (statusError) return <ErrorComponent message={statusError.message} />;

  return (
    <main id="setup-page" className="flex min-h-dvh flex-col bg-white">
      <header className="from-primary-pink to-primary-orange flex flex-col items-center justify-center gap-2 rounded-b-4xl bg-gradient-to-br p-6 pt-14 text-white drop-shadow-lg">
        <h1 className="text-2xl font-bold text-white drop-shadow-md drop-shadow-black/30">ตั้งค่าเป้าหมายการออม</h1>
        <p className="text-xs">เลือกสิ่งที่คุณอยากได้ แล้วมาเริ่มวางแผนการออมกัน!</p>
      </header>
      <SetupContent goal={goal} setGoal={setGoal} />
      <footer className="w-full bg-white p-6 pb-12 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <CtaButton onClick={handleSetGoal} disabled={goalMutation.isPending || !goal.planId}>
          {goalMutation.isPending ? "กำลังบันทึก..." : "เริ่มต้นการออม"}
        </CtaButton>
      </footer>
    </main>
  );
}
