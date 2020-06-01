'use strict';

module.exports = class PostsComment {
  static tableName() {
    return `posts_comments`;
  }

  static fields() {
    return [`comment_id`, `text`, `post_id`, `author_id`];
  }

  static create(commentId, text, postId, userId) {
    return [
      `pseudo_encrypt(${commentId})`,
      `'${text}'`,
      `pseudo_encrypt(${postId})`,
      `pseudo_encrypt(${userId})`
    ];
  }
};
