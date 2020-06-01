'use strict';

module.exports = class Post {
  static tableName() {
    return `posts`;
  }

  static fields() {
    return [`post_id`, `title`, `announce`, `text`, `picture`, `published_at`];
  }

  static create(postId, title, announce, text, date) {
    return [
      `pseudo_encrypt(${postId})`,
      `'${title}'`,
      `'${announce}'`,
      `'${text}'`,
      `'testPicture${postId}'`,
      `'${date}'`
    ];
  }
};
