'use strict';

module.exports = class User {
  static tableName() {
    return `users`;
  }

  static fields() {
    return [`user_id`, `role`, `email`, `password`, `name`, `surname`, `avatar`];
  }

  static create(userId, role) {
    return [
      `pseudo_encrypt(${userId})`,
      `'${role}'`,
      `'testEmail${userId}@gmail.com'`,
      `'testPassword${userId}'`,
      `'testName${userId}'`,
      `'testSurname${userId}'`,
      `'testAvatar${userId}'`
    ];
  }
};
