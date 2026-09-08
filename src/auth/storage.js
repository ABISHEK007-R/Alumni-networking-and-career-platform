const AUTH_STORAGE_KEYS = ["authToken", "currentUser", "alumniUser"];

const clearAuthStorage = () => {
  AUTH_STORAGE_KEYS.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
};

export { clearAuthStorage };
