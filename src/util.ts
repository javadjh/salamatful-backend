const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);

export function isProduction() {
  return getEnv('NODE_ENV') === 'production';
}

export function isDev() {
  return getEnv('NODE_ENV') === 'development';
}

export function getEnv(name, defaultVal = '') {
  let value = process.env[name] || defaultVal;
  if (typeof value === 'string') {
    value = value.trim();
  }
  return value;
}

export function normalizePhoneNumber(phone) {
  phone = phone
    ? phone
        .toString()
        .trim()
        .replace(/[^0-9]/, '')
    : '';
  if (!phone) {
    return '';
  }
  return '+' + phone;
}

export function hashPassword(password): Promise<any> {
  return bcrypt.hashSync(password, salt);
}

export default {
  isDev,
  getEnv,
};
