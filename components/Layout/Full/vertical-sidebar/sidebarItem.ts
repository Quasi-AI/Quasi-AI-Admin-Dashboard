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
{ header: 'Payments' },
{
    title: 'Payment history',
    icon: CircleDotIcon,
    to: '/pages/Payment-history'
},
{
  title: 'Payment Methods',
  icon: CircleDotIcon,
  to: '/pages/Payment-Methods'
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
