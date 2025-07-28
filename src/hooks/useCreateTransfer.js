import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

/**
 * This is the function that will be called by the mutation.
 * It now expects an object containing both the walletId and the formData.
 * @param {object} params - The parameters for the mutation.
 * @param {string} params.walletId - The ID of the wallet to associate the transaction with.
 * @param {FormData} params.formData - The form data containing the slip image and other details.
 */
const createTransfer = async ({ walletId, formData }) => {
  // The backend route is POST /transaction/:walletId
  // We construct the URL with the provided walletId.
  const url = `${process.env.NEXT_PUBLIC_API_URL}/transaction/${walletId}`;

  const { data } = await axios.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

/**
 * A custom TanStack Query hook for creating a transfer/deposit transaction.
 * @param {object} options - Configuration options.
 * @param {Function} options.onSuccessCallback - A function to call after a successful mutation.
 */
export function useCreateTransfer({ onSuccessCallback }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransfer,
    onSuccess: (data) => {
      // Display a success message from the API if available, otherwise a default one.
      toast.success(data?.message || "Slip sent successfully! Awaiting confirmation.");

      // Invalidate queries to trigger a refetch of user data (for balance) and transaction history.
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });

      // Call the success callback if it was provided (e.g., to close a modal).
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error) => {
      // Display a specific error message from the API if available.
      toast.error(error.response?.data?.message || "Failed to send slip. Please try again.");
    },
  });
}
