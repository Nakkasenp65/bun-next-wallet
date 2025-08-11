import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";

const fetchNotifications = async (userId) => {
  const { data } = await axios.get(`/notification/${userId}`);
  return data.data;
};

// --- Data Fetching ---
export function useNotification(userData) {
  return useQuery({
    queryKey: ["notifications", userData?.id],
    queryFn: () => fetchNotifications(userData.id),
    enabled: !!userData, // Fetch only when userData is available
  });
}

/**
 * A hook for marking a single notification as read.
 * This version is designed to work when notifications are nested inside a 'user' query object.
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ notificationId }) => {
      const { data } = await axios.patch(
        `/notification/${notificationId}/read`,
      );
      return data;
    },
    // This is the key change. We manually update the 'user' query cache.
    onSuccess: (data, variables) => {
      // `variables.userId` is the line_user_id we pass from the component
      queryClient.setQueryData(["user", variables.userId], (oldUserData) => {
        if (!oldUserData) return oldUserData;

        // Create a new user object to avoid direct mutation
        const newUserData = { ...oldUserData };

        // Map over the old notifications to create a new array
        newUserData.notifications = oldUserData.notifications.map((n) =>
          n.id === variables.notificationId ? { ...n, isRead: true } : n,
        );

        return newUserData;
      });
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
      const { data } = await axios.delete(
        `/notification/clear/${userId}?type=${type}`,
      );
      return data;
    },
    onSuccess: async (data, variables) => {
      toast.success("Notifications cleared!");
      // The key change is here: we invalidate the 'user' query,
      // which will cause the useUser hook to refetch everything, including the updated notifications list.
      queryClient.invalidateQueries({ queryKey: ["user", variables.userId] });
    },
    onError: () => {
      toast.error("Failed to clear notifications.");
    },
  });
}
