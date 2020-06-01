'use strict';

module.exports = class PostsCategory {
  static tableName() {
    return `posts_categories`;
  }

  static fields() {
    return [`post_id`, `category_id`];
  }

  static create(postId, categoryId) {
    return [
      `pseudo_encrypt(${postId})`,
      `pseudo_encrypt(${categoryId})`
    ];
  }
};
