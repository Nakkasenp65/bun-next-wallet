import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function fetchUserData(userId) {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`);
  return response.data;
}

export function useUser(userId) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => {
      if (!userId) {
        return Promise.reject(new Error("LIFF ID is required to fetch user data."));
      }
      return fetchUserData(userId);
    },
    enabled: !!userId,
  });
}
