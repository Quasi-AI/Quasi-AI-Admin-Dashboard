export default defineNuxtRouteMiddleware((to, from) => {
    if (process.server) return; // Skip middleware on the server side since we're using SSR: false
  
    const token = localStorage.getItem("token");
  
    if (!token && to.path !== "/auth/login") {
      return navigateTo("/auth/login");
    }
  });
  