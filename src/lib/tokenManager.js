let accessToken = null;

export const setAuthToken = (token) => {
  console.log("Token Manager: New token set.");
  accessToken = token;
};

export const getAuthToken = () => {
  return accessToken;
};

export const clearAuthToken = () => {
  accessToken = null;
};
