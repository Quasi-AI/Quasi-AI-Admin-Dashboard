import {
  LayoutDashboardIcon, BorderAllIcon,
  AlertCircleIcon, CircleDotIcon,
  BoxMultiple1Icon, LoginIcon, MoodHappyIcon, ApertureIcon, UserPlusIcon, 
  FileAnalyticsIcon, SettingsIcon, DatabaseIcon, MoodKidIcon, ZoomMoneyIcon, CashIcon,
  FileInvoiceIcon, ChartPieIcon, ReportMoneyIcon, CashBanknoteIcon,
  UsersIcon, KeyIcon, LayersIntersectIcon
} from 'vue-tabler-icons';

export interface menu {
  header?: string;
  title?: string;
  icon?: any;
  to?: string;
  chip?: string;
  BgColor?: string;
  chipBgColor?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
}

const sidebarItem: menu[] = [
  { header: 'Home' },
  {
    title: 'Dashboard',
    icon: LayoutDashboardIcon,
    to: '/'
  },

  { header: 'AI Dashboard' },
  {
    title: 'Analytics',
    icon: FileAnalyticsIcon,
    to: '/ai/analytics'
  },
  {
    title: 'AI Configuration',
    icon: SettingsIcon,
    to: '/ai/config'
  },
  {
    title: 'Database Management',
    icon: DatabaseIcon,
    to: '/ai/data-management'
  },

  { header: 'Students' },
  {
    title: "All Students",
    icon: MoodKidIcon,
    to: "/ui-components/Students",
  },
  {
    title: "Student Reports",
    icon: ChartPieIcon,
    to: "/ui-components/StudentReports",
  },

  { header: 'Educators' },
  {
    title: "All Educators",
    icon: MoodHappyIcon,
    to: "/ui-components/Educators",
  },
  {
    title: "Educator Reports",
    icon: ReportMoneyIcon,
    to: "/ui-components/EducatorReports",
  },

  { header: 'Payments & Subscriptions' },
  {
    title: 'Payment History',
    icon: CashIcon,
    to: '/pages/Payment-history'
  },
  {
    title: 'Subscription Plans',
    icon: ZoomMoneyIcon,
    to: '/pages/subscriptions'
  },
  {
    title: 'Invoices',
    icon: FileInvoiceIcon,
    to: '/pages/invoices'
  },
  {
    title: 'Financial Overview',
    icon: CashBanknoteIcon,
    to: '/pages/financial-overview'
  },

  { header: 'Admin & Security' },
  {
    title: 'Add Admin',
    icon: UserPlusIcon,
    to: '/pages/addAdmin'
  },
  {
    title: 'Access Level',
    icon: AlertCircleIcon,
    to: '/pages/accessLevel'
  },
  {
    title: 'Security Logs',
    icon: KeyIcon,
    to: '/pages/security-logs'
  },

  { header: 'Management' },
  {
    title: 'Email Management',
    icon: ApertureIcon,
    to: '/pages/Email'
  },
  {
    title: 'Inbox',
    icon: BoxMultiple1Icon,
    to: '/pages/inbox'
  },
  {
    title: 'Feedbacks',
    icon: ApertureIcon,
    to: '/pages/feedbacks'
  },
  {
    title: 'System Logs',
    icon: LayersIntersectIcon,
    to: '/pages/system-logs'
  },
];

export default sidebarItem;
