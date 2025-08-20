import HomeIcon from '@/assets/HomeIcon.svg';
import Truck from '@/assets/Truck.svg';
import Care from '@/assets/HealthCare.svg';
import Billing from '@/assets/Billing.svg';
import Reports from '@/assets/Reports.svg';
import Account from '@/assets/Account.svg';
import Support from '@/assets/Support.svg';

export const sidebarData = [
  // Menu section
  {
    id: 0,
    label: 'Menu',
    isSection: true,
  },

  // Main menu items
  {
    id: 1,
    label: 'Home',
    icon: HomeIcon,
    link: '/',
    children: [],
    addSeparator: false,
    module: 'dashboard',
  },

  {
    id: 2,
    label: 'Fleet Management',
    icon: Truck,
    activeIcon: Truck,
    link: '/fleet',
    children: [
      {
        id: 21,
        label: 'Fleet View',
        link: '/fleet/fleet-view',
        module: 'fleet-view',
      },
      // {
      //   id: 22,
      //   label: 'Equipment Listing',
      //   link: '/fleet/equipment-listing',
      // },
      {
        id: 23,
        label: 'Telematics',
        link: '/fleet/telematics',
        module: 'telematics',
      },
      {
        id: 24,
        label: 'DOT & PM Compliance',
        link: '/fleet/dot-pm-compliance',
        module: 'dot-pm-compliance',
      },
      {
        id: 25,
        label: 'Agreements',
        link: '/fleet/agreements',
        module: 'agreements',
      },
      {
        id: 26,
        label: 'Insurance',
        link: '/fleet/insurance',
        disabled: true,
      },
      {
        id: 27,
        label: 'Equipment Moves',
        link: '/fleet/equipment-moves',
        disabled: true,
      },
    ],
    addSeparator: false,
  },

  {
    id: 3,
    label: 'TEN Care',
    icon: Care,
    link: '/ten-care',
    children: [
      {
        id: 31,
        label: 'Work Orders (M&R)',
        link: '/ten-care/work-orders',
      },
      {
        id: 32,
        label: 'Estimates',
        link: '/ten-care/estimates',
        disabled: true,
      },
      {
        id: 33,
        label: 'Emergency Responsive Service',
        link: '/ten-care/emergency-response-service',
        count: 48,
      },
      {
        id: 34,
        label: 'Request Service History',
        link: '/ten-care/request-service-history',
      },
    ],
    addSeparator: false,
  },

  {
    id: 4,
    label: 'Billing',
    icon: Billing,
    link: '/billing',
    children: [
      {
        id: 41,
        label: 'Invoices',
        link: '/billing/invoices',
      },
      {
        id: 42,
        label: 'Payments',
        link: '/billing/payments',
      },
    ],
    addSeparator: false,
  },

  {
    id: 5,
    label: 'Reports',
    icon: Reports,
    link: '/reports',
    children: [
      {
        id: 51,
        label: 'Report Explorer',
        link: '/reports/explorer',
      },
      {
        id: 52,
        label: 'Custom Reports & Alerts',
        link: '/reports/custom-reports',
        disabled: true,
      },
    ],
    addSeparator: false,
  },

  // Settings section
  {
    id: 6,
    label: 'Settings',
    isSection: true,
    addSeparator: true,
  },

  {
    id: 7,
    label: 'Account Management',
    icon: Account,
    link: '/account-management',
    children: [
      {
        id: 71,
        label: 'Accounts',
        link: '/account-management/accounts',
        module: 'accounts',
      },

      {
        id: 72,
        label: 'Account Preferences',
        link: '/account-management/account-preferences',
        disabled: true,
      },
      {
        id: 73,
        label: 'Alert & Notifications',
        link: '/account-management/alerts-and-notifications',
      },

      {
        id: 74,
        label: 'User Management',
        link: '/account-management/user-management',
        module: 'user-management',
      },
      {
        id: 75,
        label: 'User Roles and Permissions',
        link: '/account-management/user-roles-and-permissions',
        module: 'user-management',
      },
    ],
    addSeparator: false,
  },

  {
    id: 8,
    label: 'Support',
    icon: Support,
    link: '/support',
    disabled: true,

    addSeparator: false,
  },
];

export const tenAdminSidebarData = [
  {
    id: 1,
    label: 'All Accounts',
    icon: Account,
    link: '/customers',
    children: [],
    addSeparator: false,
  },
  {
    id: 2,
    label: 'Customer Users',
    icon: Account,
    link: '/customer-users',
    children: [],
    addSeparator: false,
  },
];
