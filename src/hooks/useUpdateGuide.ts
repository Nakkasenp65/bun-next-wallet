import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { AxiosError } from "axios";

interface UpdateGuideParams {
  lineUserId: string;
  guideShown: boolean;
}

export function useUpdateGuide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ lineUserId, guideShown }: UpdateGuideParams) => {
      const { data } = await axios.patch(`/user/${lineUserId}/guide-shown`, {
        guideShown,
      });
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate user query to reflect the change
      queryClient.invalidateQueries({ queryKey: ["user", variables.lineUserId] });
    },
    onError: (error: AxiosError<any>) => {
      console.error("Failed to update guide status:", error);
    },
  });
}
