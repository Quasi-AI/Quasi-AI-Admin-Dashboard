import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { PermissionsManager } from "~/permissionStore/permission";

export default defineNuxtRouteMiddleware((to) => {
  const userPermissions = PermissionsManager.getInstance().getPermissions();

  // If the route has a permission requirement
  if (to.meta?.permission) {
    const requiredPermission = to.meta.permission as string;
    
    // Check if the user has the required permission
    if (!userPermissions?.[requiredPermission]) {
      console.warn(`Access denied: Missing permission for ${to.fullPath}`);
      return navigateTo("/unauthorized"); // Redirect to an "unauthorized" page
    }
  }

  // Proceed to the requested route (implicitly returns void)
});

