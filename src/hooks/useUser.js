import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const MOCK_USER_DATA = {
  id: "6881b8e1bbaf3f3d6c894353",
  userId: "U5d2998909721fdea596f8e9e91e7bf85",
  username: "username",
  firstTime: false,
  userProfilePicUrl:
    "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fvectors%2Fblank-profile-picture-mystery-man-973460%2F&psig=AOvVaw1jZIKgex_FiR-CEz5lqFzD&ust=1753418317014000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCKjs5rHW1I4DFQAAAAAdAAAAABAE",
  createdAt: "2025-07-24T04:38:56.909Z",
  updatedAt: "2025-07-24T05:24:50.395Z",
  wallet: {
    id: "6881b8e1bbaf3f3d6c894354",
    balance: 35000,
    userId: "6881b8e1bbaf3f3d6c894353",
    createdAt: "2025-07-24T04:38:56.909Z",
    updatedAt: "2025-07-24T06:15:09.327Z",
  },
  goal: {
    id: "68833899e9834ce627d68f80",
    status: "ACTIVE",
    planId: "6881f45eca2899c984e09cfa",
    userId: "6881b8e1bbaf3f3d6c894353",
    mobileModelId: "6881f553ca2899c984e09d07",
    createdAt: "2025-07-25T07:56:09.805Z",
    updatedAt: "2025-07-25T07:56:09.805Z",
    mobileModel: {
      id: "6881f553ca2899c984e09d07",
      name: "Galaxy S20 Ultra ",
      price: 48900,
      brandId: "6881f4bdca2899c984e09d00",
      createdAt: "2025-07-24T08:56:50.994Z",
      updatedAt: "2025-07-24T08:54:25.677Z",
      brand: {
        id: "6881f4bdca2899c984e09d00",
        name: "Samsung",
        createdAt: "2025-07-24T08:54:20.815Z",
        updatedAt: "2025-07-24T08:54:02.312Z",
      },
    },
    plan: {
      id: "6881f45eca2899c984e09cfa",
      name: "HALF_MONTH",
      displayName: "ราย 15 วัน",
    },
  },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

let config = {
  method: "get",
  maxBodyLength: Infinity,
  url: "https://bd80e7be1330.ngrok-free.app/v1/user/U5d2998909721fdea596f8e9e91e7bf85",
  headers: {},
};

async function fetchMockUserData(userId) {
  const response = await axios.get(`${API_URL}/user/${userId}`);
  // const response = await axios.request(config);
  // console.log(response);
  // return MOCK_USER_DATA;
  return response.data;
}

export function useUser(userId) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => {
      if (!userId) {
        return Promise.reject(new Error("LIFF ID is required to fetch user data."));
      }
      return fetchMockUserData(userId);
    },
    enabled: !!userId,
  });
}
