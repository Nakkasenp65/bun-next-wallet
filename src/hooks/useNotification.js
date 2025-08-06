import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";

const fetchNotifications = async (userId) => {
  const { data } = await axios.get(`/notification/${userId}`);
  return data.data;
};

const markAsReadMutationFn = async ({ notificationId, userMongoId }) => {
  if (!notificationId || !userMongoId) {
    throw new Error("Notification ID and User ID are required.");
  }
  const url = `/notification/${notificationId}/${userMongoId}/read`;
  const { data } = await axios.patch(url);
  return data.data;
};

const clearNotificationsMutationFn = async (type) => {
  const { data } = await axios.delete(`/notification/clear?type=${type}`);
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

// --- Mutations ---
export function markAsReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAsReadMutationFn,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["notifications", userData?.id],
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to mark as read.");
    },
  });
}

export function clearNotificationsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearNotificationsMutationFn,
    onSuccess: (data) => {
      toast.success(`${data.count} notifications cleared!`);
      queryClient.invalidateQueries({
        queryKey: ["notifications", userData?.id],
      });
    },
    onError: () => {
      toast.error("Failed to clear notifications.");
    },
  });
}
