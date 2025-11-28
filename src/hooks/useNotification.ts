import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import toast from "react-hot-toast";
import { Notification } from "@/types/prisma";

export function useNotification(userId: string | undefined) {
  return useQuery({
    queryKey: ["notification", userId],
    queryFn: async () => {
      const { data } = await axios.get<{ data: Notification[] }>(`/notification/${userId}`);
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
interface MarkReadVariables {
  userId: string;
  notificationId: string;
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, notificationId }: MarkReadVariables) => {
      const { data } = await axios.patch(
        `/notification/${notificationId}/read`,
      );
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notification", variables.userId] });
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
interface ClearNotificationsVariables {
  type?: string;
  userId: string;
}

export function useClearNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ type, userId }: ClearNotificationsVariables) => {
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

/**
 * A hook for deleting a single notification.
 */
interface DeleteNotificationVariables {
  notificationId: string;
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ notificationId }: DeleteNotificationVariables) => {
      const { data } = await axios.delete(`/notification/${notificationId}`);
      return data;
    },
    onSuccess: async (data, variables) => {
      toast.success("ลบการแจ้งเตือนสำเร็จ!");
      // Invalidate to refetch the notification list
      await queryClient.invalidateQueries({
        queryKey: ["notification"],
      });
    },
    onError: () => {
      toast.error("ไม่สามารถลบการแจ้งเตือนได้");
    },
  });
}
