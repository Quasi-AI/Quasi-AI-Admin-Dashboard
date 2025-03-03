import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import Login from '@/pages/auth/Login.vue';
import AdminDashboard from '@/pages/dashboard/index.vue';
import Analytics from '@/pages/ai/analytics.vue';
import AIConfig from '@/pages/ai/config.vue';
import DatabaseManagement from '@/pages/ai/data-management.vue';
import AllStudents from '@/pages/ui-components/Students.vue';
import StudentReports from '@/pages/ui-components/StudentReports.vue';
import AllEducators from '@/pages/ui-components/Educators.vue';
import EducatorReports from '@/pages/ui-components/EducatorReports.vue';
import PaymentHistory from '@/pages/pages/Payment-history.vue';
import Invoices from '@/pages/pages/invoices.vue';
import FinancialOverview from '@/pages/pages/financial-overview.vue';
import AddAdmin from '@/pages/pages/addAdmin.vue';
import AccessLevel from '@/pages/pages/accessLevel.vue';
import SecurityLogs from '@/pages/pages/security-logs.vue';
import EmailManagement from '@/pages/pages/Email.vue';
import Inbox from '@/pages/pages/inbox.vue';
import Feedbacks from '@/pages/pages/Feedbacks.vue';
import SystemLogs from '@/pages/pages/system-logs.vue';
import { PermissionsManager } from '@/permissionStore/permission';


declare module 'vue-router' {
    interface RouteMeta {
      requiresAuth?: boolean;
      permission?: string;
    }
  }
  
// Define routes dynamically based on sidebar items
const routes: Array<RouteRecordRaw> = [
  { path: '/auth/login', component: Login },
  { path: '/', component: AdminDashboard, meta: { requiresAuth: true, permission: 'dashboard' } },
  { path: '/ai/analytics', component: Analytics, meta: { requiresAuth: true, permission: 'aiAnalytics' } },
  { path: '/ai/config', component: AIConfig, meta: { requiresAuth: true, permission: 'aiConfig' } },
  { path: '/ai/data-management', component: DatabaseManagement, meta: { requiresAuth: true, permission: 'databaseManagement' } },
  { path: '/ui-components/Students', component: AllStudents, meta: { requiresAuth: true, permission: 'students' } },
  { path: '/ui-components/StudentReports', component: StudentReports, meta: { requiresAuth: true, permission: 'studentReports' } },
  { path: '/ui-components/Educators', component: AllEducators, meta: { requiresAuth: true, permission: 'educators' } },
  { path: '/ui-components/EducatorReports', component: EducatorReports, meta: { requiresAuth: true, permission: 'educatorReports' } },
  { path: '/pages/Payment-history', component: PaymentHistory, meta: { requiresAuth: true, permission: 'payments' } },
  { path: '/pages/invoices', component: Invoices, meta: { requiresAuth: true, permission: 'invoices' } },
  { path: '/pages/financial-overview', component: FinancialOverview, meta: { requiresAuth: true, permission: 'financialOverview' } },
  { path: '/pages/addAdmin', component: AddAdmin, meta: { requiresAuth: true, permission: 'addAdmin' } },
  { path: '/pages/accessLevel', component: AccessLevel, meta: { requiresAuth: true, permission: 'accessLevel' } },
  { path: '/pages/security-logs', component: SecurityLogs, meta: { requiresAuth: true, permission: 'securityLogs' } },
  { path: '/pages/Email', component: EmailManagement, meta: { requiresAuth: true, permission: 'emailManagement' } },
  { path: '/pages/inbox', component: Inbox, meta: { requiresAuth: true, permission: 'inbox' } },
  { path: '/pages/feedbacks', component: Feedbacks, meta: { requiresAuth: true, permission: 'feedbacks' } },
  { path: '/pages/system-logs', component: SystemLogs, meta: { requiresAuth: true, permission: 'systemLogs' } },
];

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard for authentication & permissions
router.beforeEach((to, from, next) => {
  const userPermissions = PermissionsManager.getInstance().getPermissions();
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    next('/auth/login');
  } else if (to.meta.permission && !userPermissions[to.meta.permission]) {
    next('/'); // Redirect unauthorized users
  } else {
    next();
  }
});

export default router;
