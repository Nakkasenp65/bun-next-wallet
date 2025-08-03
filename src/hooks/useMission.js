import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios"; // Assuming you use axios for API calls

const fetchAvailableMissions = async () => {
  const { data } = await axios.get(`/mission`);
  return data;
};

export const useGetMissions = () => {
  return useQuery({
    queryKey: ["availableMissions"],
    queryFn: () => fetchAvailableMissions(),
  });
};
