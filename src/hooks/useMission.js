import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios"; // Assuming you use axios for API calls

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchAvailableMissions = async () => {
  const { data } = await axios.get(`${BACKEND_URL}/mission`);
  return data;
};

const enrollInMission = async (missionId) => {
  const { data } = await axios.post("/api/missions/enroll", { missionId });
  return data;
};

export const useGetMissions = () => {
  return useQuery({
    queryKey: ["availableMissions"],
    queryFn: fetchAvailableMissions,
  });
};

export const useEnrollMission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: enrollInMission,
    onSuccess: () => {
      console.log("Successfully enrolled. Invalidating mission list...");
      queryClient.invalidateQueries({ queryKey: ["availableMissions"] });
      queryClient.invalidateQueries({ queryKey: ["userMissions"] });
    },
    onError: (error) => {
      console.error("An error occurred while enrolling in the mission:", error);
    },
  });
};
