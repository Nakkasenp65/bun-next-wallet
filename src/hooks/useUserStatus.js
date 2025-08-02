import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";

const fetchUserStatus = async (userId) => {
  const { data } = await axios.get(`/user/status/${userId}`);
  return data.data;
};

export function useUserStatus(userId) {
  return useQuery({
    queryKey: ["userStatus", userId],
    queryFn: () => fetchUserStatus(userId),
    enabled: !!userId,
  });
}
