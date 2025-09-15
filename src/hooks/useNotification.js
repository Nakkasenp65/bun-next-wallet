import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import toast from "react-hot-toast";

export function useNotification(userId) {
  return useQuery({
    queryKey: ["notification", userId],
    queryFn: async () => {
      const { data } = await axios.get(`/notification/${userId}`);
      return data.data;
    },
    enabled: !!userId,
    refetchOnMount: "always",
  });
}

/**
 * A hook for marking a single notification as read.
 * This version is designed to work when notifications are nested inside a 'user' query object.
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, notificationId }) => {
      const { data } = await axios.patch(
        `/notification/${notificationId}/read`,
      );
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["notification", variables.userId]);
    },
    onError: () => {
      toast.error("Failed to mark as read.");
    },
  });
}

/**
 * A hook for clearing notifications.
 * This version invalidates the entire 'user' query to refetch all data.
 */
export function useClearNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ type, userId }) => {
      // userId is not needed in the API call itself
      const { data } = await axios.delete(`/notification/clear/${userId}`, {
        params: {
          type,
        },
      });
      return data;
    },
    onSuccess: async (data, variables) => {
      toast.success("ล้างการแจ้งเตือนทั้งหมดสำเร็จ!");
      // The key change is here: we invalidate the 'user' query,
      // which will cause the useUser hook to refetch everything, including the updated notifications list.
      await queryClient.invalidateQueries({
        queryKey: ["notification", variables.userId],
      });
    },
    onError: () => {
      toast.error("Failed to clear notifications.");
    },
  });
}
