"use client";
import { useGetUser, useUpdateUser } from "@/hooks/useUser";
import { useParams } from "next/navigation";
import EditProfile from "@/components/profile/EditProfile";
import Loading from "@/components/StatusComponents/Loading";
import ErrorComponent from "@/components/Ui/ErrorComponent";

export default function Page() {
  const params = useParams();
  const {
    data: userData,
    isLoading: isUserDataLoading,
    isError: isUserDataError,
  } = useGetUser(params.userId);

  const { mutate: updateUser, isPending: isSaving } = useUpdateUser();

  const handleSave = (updateData) => {
    // เรียกใช้ mutation พร้อมกับ userId และข้อมูลใหม่
    updateUser({ mongoId: userData.id, updateData });
  };

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

  return (
    <EditProfile user={userData} onSave={handleSave} isSaving={isSaving} />
  );
}
