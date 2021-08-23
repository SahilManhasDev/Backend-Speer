const USER_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
};
const USER_STATUS_LIST = [
  'pending',
  'active',
];
const CITY_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
};
const CITY_STATUS_LIST = [
  'pending',
  'active',
];
const USER_ROLES = {
  ADMIN: 'admin',
  FRANCHISE_OWNER: 'franchise_owner',
  CUSTOMER: 'customer',
  DRIVER: 'driver',
  FRANCHISE_MANAGER: 'franchise_manager',
  FRANCHISE_STAFF: 'franchise_staff',
  PICKUP_AGENT: 'pickup_agent',
};
const USER_ROLES_LIST = [
  'admin',
  'franchise_owner',
  'customer',
  'driver',
  'franchise_manager',
  'franchise_staff',
  'pickup_agent'
];
const SALT_ROUNDS = 10;

const ORDER_STATUS = {
  PLACED: 'Placed',
  CONFIRMED: 'Confirmed',
  PICKUP_READY: 'Ready to PickUp',
  PICKED_UP: 'Picked Up',
  IN_PROCESS: 'In Process',
  SHIPPED: 'Shipped',
  IN_TRANSMIT: 'In Transmit',
  DELIVERED: 'Delivered',
  REJECTED: 'Rejected'
};
const ORDER_STATUS_LIST = [
  'Placed',
  'Confirmed',
  'Ready to PickUp',
  'Picked Up',
  'In Process',
  'Shipped',
  'In Transmit',
  'Delivered',
  'Rejected'
];

const PAYMENT_METHOD_LIST = [
  'Cash on delivery',
  'Debit/Credit card',
  'UPI',
  'Netbanking'
];

const SERVICE_TYPE = {
  KG_BASED :'kg_based',
  PIECE_BASED:'piece_based'
}

module.exports = {
  USER_STATUS,
  USER_ROLES,
  SALT_ROUNDS,
  USER_ROLES_LIST,
  USER_STATUS_LIST,
  CITY_STATUS,
  CITY_STATUS_LIST,
  ORDER_STATUS,
  ORDER_STATUS_LIST,
  PAYMENT_METHOD_LIST,
  SERVICE_TYPE
};