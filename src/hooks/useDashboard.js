import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

const fetchAdminDashboardData = async () => {
  const { data } = await axios.get("/admin");
  return data;
};

export function useAdminDashboardData() {
  return useQuery({
    queryKey: ["adminDashboard"],
    queryFn: () => fetchAdminDashboardData(),
  });
}
