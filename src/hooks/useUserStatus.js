import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const BACKEND_API = process.env.NEXT_PUBLIC_API_URL;

const fetchUserStatus = async (userId) => {
  const { data } = await axios.get(`${BACKEND_API}/user/status/${userId}`);
  return data.data;
};

export function useUserStatus(userId) {
  return useQuery({
    queryKey: ["userStatus", userId],
    queryFn: () => fetchUserStatus(userId),
    enabled: !!userId,
  });
}
