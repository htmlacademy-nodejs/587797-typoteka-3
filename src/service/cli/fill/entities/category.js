'use strict';

module.exports = class Category {
  static tableName() {
    return `categories`;
  }

  static fields() {
    return [`category_id`, `name`];
  }

  static create(categoryId, categoryName) {
    return [
      `pseudo_encrypt(${categoryId})`,
      `'${categoryName}'`
    ];
  }
};
