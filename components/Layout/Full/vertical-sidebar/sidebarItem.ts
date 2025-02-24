import {
  LayoutDashboardIcon,BorderAllIcon,
  AlertCircleIcon,
  CircleDotIcon,
  BoxMultiple1Icon,
  LoginIcon, MoodHappyIcon, ApertureIcon, UserPlusIcon
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
    icon: LayoutDashboardIcon,
    to: '/ai/analytics'
  },
  {
    title: 'AI Configuration',
    icon: LayoutDashboardIcon,
    to: '/ai/config'
  },
  {
    title: 'Database Management',
    icon: LayoutDashboardIcon,
    to: '/ai/data-management'
  },

  { header: 'Students' },
  {
    title: "All Students",
    icon: MoodHappyIcon,
    to: "/ui-components/Students",
  },

  { header: 'Educators' },
  {
    title: "All Educators",
    icon: MoodHappyIcon,
    to: "/ui-components/Educators",
  },

  { header: 'Account' },
  {
    title: 'Add Admin',
    icon: AlertCircleIcon,
    to: '/pages/addAdmin'
  },
  {
    title: 'Access Level',
    icon: AlertCircleIcon,
    to: '/pages/accessLevel'
  },
{ header: 'Payments' },
{
    title: 'Payment history',
    icon: CircleDotIcon,
    to: '/pages/Payment-history'
},

{ header: 'Management' },
{
    title: 'Email',
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
  to: '/pages/Feedbacks'
},

];

export default sidebarItem;
