import {
  LayoutDashboardIcon, FileAnalyticsIcon, SettingsIcon, DatabaseIcon, MoodKidIcon, 
  ChartPieIcon, MoodHappyIcon, ReportMoneyIcon, CashIcon, FileInvoiceIcon, 
  CashBanknoteIcon, UserPlusIcon, AlertCircleIcon, KeyIcon, ApertureIcon, 
  BoxMultiple1Icon, LayersIntersectIcon, ActivityIcon, ChartBubbleIcon, ReportAnalyticsIcon
} from 'vue-tabler-icons';

import { computed } from 'vue';

import { PermissionsManager } from "~/permissionStore/permission";


export interface menu {
  header?: string;
  title?: string;
  icon?: any;
  to?: string;
  children?: menu[];
  disabled?: boolean;
  permission?: string;
}


const sidebarItem: menu[] = [
  { header: 'Home' },
  {
    title: 'Dashboard',
    icon: LayoutDashboardIcon,
    to: '/',
    permission: 'dashboard',
  },
  { header: 'AI Dashboard' },
  {
    title: 'Analytics',
    icon: FileAnalyticsIcon,
    to: '/ai/analytics',
    permission: 'aiAnalytics',
  },
  {
    title: 'AI Configuration',
    icon: SettingsIcon,
    to: '/ai/config',
    permission: 'aiConfig',
  },
  {
    title: 'Database Management',
    icon: DatabaseIcon,
    to: '/ai/data-management',
    permission: 'databaseManagement',
  },
  { header: 'Students' },
  {
    title: "All Students",
    icon: MoodKidIcon,
    to: "/ui-components/Students",
    permission: "students",
  },
  {
    title: "Student Reports",
    icon: ChartPieIcon,
    to: "/ui-components/StudentReports",
    permission: "studentReports",
  },
  { header: 'Educators' },
  {
    title: "All Educators",
    icon: MoodHappyIcon,
    to: "/ui-components/Educators",
    permission: "educators",
  },
  {
    title: "Educator Reports",
    icon: ReportMoneyIcon,
    to: "/ui-components/EducatorReports",
    permission: "educatorReports",
  },
  { header: 'Payments & Subscriptions' },
  {
    title: 'Payment History',
    icon: CashIcon,
    to: '/pages/Payment-history',
    permission: "payments",
  },
  {
    title: 'Invoices',
    icon: FileInvoiceIcon,
    to: '/pages/invoices',
    permission: "invoices",
  },
  {
    title: 'Financial Overview',
    icon: CashBanknoteIcon,
    to: '/pages/financial-overview',
    permission: "financialOverview",
  },
  { header: 'Admin & Security' },
  {
    title: 'Add Admin',
    icon: UserPlusIcon,
    to: '/pages/addAdmin',
    permission: "addAdmin",
  },
  {
    title: 'Access Level',
    icon: AlertCircleIcon,
    to: '/pages/accessLevel',
    permission: "accessLevel",
  },
  {
    title: 'Security Logs',
    icon: KeyIcon,
    to: '/pages/security-logs',
    permission: "securityLogs",
  },
  { header: 'Management' },
  {
    title: 'Email Management',
    icon: ApertureIcon,
    to: '/pages/Email',
    permission: "emailManagement",
  },
  {
    title: 'Inbox',
    icon: BoxMultiple1Icon,
    to: '/pages/inbox',
    permission: "inbox",
  },
  {
    title: 'Feedbacks',
    icon: ApertureIcon,
    to: '/pages/feedbacks',
    permission: "feedbacks",
  },
  
  {
    title: 'System Logs',
    icon: LayersIntersectIcon,
    to: '/pages/system-logs',
    permission: "systemLogs",
  },
  { header: 'Report' },
  {
    title: 'Reported Issues',
    icon: ReportAnalyticsIcon,
    to: '/pages/audit-logs'
    // permission: "payments",
  },
];


const token = ref(localStorage.getItem('token')); // Reactive token
const userPermissions = ref(PermissionsManager.getInstance().getPermissions());

const filteredSidebarItems = computed(() => {
  if (!token.value) return []; // If token is inactive, return an empty sidebar
  return sidebarItem.filter(item => {
    if (item.header) return true;
    if (!item.permission) return true;
    return userPermissions.value[item.permission];
  });
});


export default filteredSidebarItems;
