let accessToken: string | null = null;

export const setAuthToken = (token: string) => {
  console.log("Token Manager: New token set.");
  accessToken = token;
};

export const getAuthToken = () => {
  return accessToken;
};

export const clearAuthToken = () => {
  accessToken = null;
};
