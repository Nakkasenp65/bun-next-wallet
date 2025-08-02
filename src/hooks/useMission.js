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

// --- TanStack Query Custom Hooks ---

/**
 * @description Custom hook to fetch the list of available missions.
 * It handles fetching, caching, loading, and error states automatically.
 *
 * @example
 * const { data: missions, isLoading, error } = useGetMissions();
 * if (isLoading) return <p>Loading missions...</p>;
 * return ( <ul> {missions.map(m => <li key={m.id}>{m.title}</li>)} </ul> );
 */
export const useGetMissions = () => {
  return useQuery({
    queryKey: ["availableMissions"],
    queryFn: fetchAvailableMissions,

    // Optional: You can add more configurations here, e.g., staleTime, refetchOnWindowFocus.
  });
};

/**
 * @description Custom hook to handle the "enroll in mission" action (mutation).
 * It provides a `mutate` function to trigger the action and handles invalidating
 * stale data upon success to automatically refresh the UI.
 *
 * @example
 * const { mutate: enroll, isLoading: isEnrolling } = useEnrollMission();
 * const handleEnroll = (missionId) => {
 *   enroll(missionId, {
 *     onSuccess: () => console.log("Enrolled successfully!"),
 *     onError: (err) => console.error("Failed to enroll:", err),
 *   });
 * };
 * return <button onClick={() => handleEnroll(mission.id)} disabled={isEnrolling}>
 *   {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
 * </button>
 */
export const useEnrollMission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: enrollInMission, // The function that performs the async action

    // The `onSuccess` callback is triggered after the mutation succeeds.
    onSuccess: () => {
      // `invalidateQueries` tells TanStack Query that the data associated with
      // the 'availableMissions' key is now stale and needs to be refetched.
      // This will automatically update the list of missions on the screen,
      // removing the one the user just enrolled in.
      console.log("Successfully enrolled. Invalidating mission list...");
      queryClient.invalidateQueries({ queryKey: ["availableMissions"] });

      // It's also good practice to invalidate the list of the user's *own* missions,
      // so any component displaying "My Active Missions" will also update.
      // You would create a separate hook (`useGetUserMissions`) for this.
      queryClient.invalidateQueries({ queryKey: ["userMissions"] });
    },

    // Optional: Handle errors globally here if you want.
    onError: (error) => {
      console.error("An error occurred while enrolling in the mission:", error);
      // You could show a toast notification here.
    },
  });
};
