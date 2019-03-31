const URL = 'http://localhost:5000'

export const REMOVE_PAYMENT_METHOD = URL + '/api/user/payment-method/remove';

export const LOGIN = URL + '/api/users/login';

export const ADD_PAYMENT_METHOD = URL + '/api/user/payment-method/add';

export const TEST_HEADER_AUTH = URL + '/api/user/me';

export const ADD_SUBSCRIPTION = URL + '/api/user/subscription/add'

export const ADD_QUOTE = URL + '/api/user/quote/add';

export const REGISTER_USER = URL + '/api/users/register';

export const UPDATE_AUTORENEW = URL + '/api/user/auto-renew';

export const PAY_INVOICE = URL + '/api/user/pay-invoice';

export const UPDATE_PASSWORD = URL + '/api/user/reset-password';

export const UPDATE_EMAIL = URL + '/api/user/reset-email';

export const PASSWORD_RECOVER = URL + '/api/users/recover-password';

export const PASSWORD_RESET = URL + '/api/users/verify-token';

export const VERIFY_PROMO = URL + '/api/user/verify-promo';

export const ACCEPT_QUOTE = URL + '/api/user/quote/accept';

export const GET_USER = URL + '/api/user/get-account';

export const GET_PLAN_FROM_ID = URL + '/api/user/get-subscription-by-id';

export const GET_USER_PROMO = URL + '/api/user/verify-user-specific-promo'