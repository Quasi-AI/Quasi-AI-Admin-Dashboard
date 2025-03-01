export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return; // ✅ Skip middleware on server-side

  const token = localStorage.getItem("token");

  // ✅ If no token & user is not already on the login page, redirect to login
  if (!token) {
    if (to.path !== "/auth/login") {
      return navigateTo("/auth/login");
    }
    return; // ✅ Prevents infinite redirect loop
  }

  // ✅ Check if token is valid & not expired
  try {
    const tokenParts = token.split(".");
    
    if (tokenParts.length !== 3) throw new Error("Invalid Token Format"); // ✅ Ensure it's a proper JWT

    const tokenPayload = JSON.parse(atob(tokenParts[1])); // ✅ Decode JWT payload safely
    const tokenExpiry = tokenPayload.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();

    if (currentTime >= tokenExpiry) {
      console.warn("Token expired. Logging out...");
      logoutUser();
      if (to.path !== "/auth/login") {
        return navigateTo("/auth/login");
      }
      return; // ✅ Prevents infinite loop
    }
  } catch (error) {
    console.error("Invalid token. Logging out...", error);
    logoutUser();
    if (to.path !== "/auth/login") {
      return navigateTo("/auth/login");
    }
    return; // ✅ Prevents infinite loop
  }
});

// ✅ Logout function: Clears token & redirects
const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
