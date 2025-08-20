type obj = Record<string, string>;

export const STATUS_TYPES = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  OVERDUE: 'overdue',
};

export const ACCOUNT_TYPES = {
  1: 'TenAdmin',
  2: 'SuperAdmin',
  3: 'AccountUser',
  4: 'AccountAdmin',
};
export const USER_ROLES = {
  TEN_ADMIN: 'TenAdmin',
  SUPER_ADMIN: 'SuperAdmin',
  ACCOUNT_ADMIN: 'AccountAdmin',
  ACCOUNT_USER: 'AccountUser',
};

export const USER_ROLE_LABELS: obj = {
  [USER_ROLES.TEN_ADMIN]: 'Ten Admin',
  [USER_ROLES.SUPER_ADMIN]: 'Super Admin',
  [USER_ROLES.ACCOUNT_ADMIN]: 'Account Admin',
  [USER_ROLES.ACCOUNT_USER]: 'Account User',
};

export const LIST = 'list'
export const CIRCLE = 'Circle'
export const POLYGON = 'Polygon'
export const ACTIVE = 'ACTIVE'
export const INACTIVE = 'IN-ACTIVE'
