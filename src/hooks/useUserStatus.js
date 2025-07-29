import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchUserStatus = async (userId) => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/status/${userId}`);
  return data.data; // Returns { isNewUser: boolean, firstTime: boolean }
};

export function useUserStatus(userId) {
  return useQuery({
    queryKey: ["userStatus", userId],
    queryFn: () => fetchUserStatus(userId),
    enabled: !!userId,
  });
}
