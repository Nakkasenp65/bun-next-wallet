"use client";
import { useGetUser } from "@/hooks/useUser";
import { useParams } from "next/navigation";
import Profile from "@/components/profile/Profile"; // Import the new UI component
import Loading from "@/components/StatusComponents/Loading"; // Assuming you have a Loading component
import ErrorComponent from "@/components/Ui/ErrorComponent";

export default function Page() {
  const params = useParams();
  const {
    data: userData,
    isLoading: isUserDataLoading,
    isError: isUserDataError, // Use isError for clarity
  } = useGetUser(params.userId);

  if (isUserDataLoading) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isUserDataError || !userData) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <ErrorComponent message="ไม่สามารถโหลดข้อมูลผู้ใช้ได้" />
      </div>
    );
  }

  // If data is loaded successfully, render the profile UI
  return <Profile user={userData} />;
}
