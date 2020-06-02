'use strict';

const moment = require(`moment`);

const User = require(`./entities/user`);
const Post = require(`./entities/post`);
const PostsComment = require(`./entities/posts-comment`);
const Category = require(`./entities/category`);
const PostsCategory = require(`./entities/posts-category`);

const {
  getRandomElement,
  getRandomInt,
  shuffleArray,
  readContent,
} = require(`../../../utils`);

const {
  FilePath,
  MONTH_MILLISECONDS
} = require(`../../../constants`);

const MaxValue = {
  ANNOUNCE: 2,
  TEXT: 3
};

const CommentsCount = {
  MIN: 2,
  MAX: 5
};

class Creator {
  constructor(postsCount, categories, comments, postsTitles, sentences) {
    this._postsCount = postsCount;
    this._categories = categories;
    this._categoriesCount = this._categories.length;
    this._commentText = comments;
    this._postsTitles = postsTitles;
    this._sentences = sentences;

    this._usersCount = Math.floor(this._postsCount / 2);
    this._commentCounter = 1;
  }

  fillEntitiesDTO(builder) {
    [
      User.tableName(),
      Category.tableName(),
      Post.tableName(),
      PostsComment.tableName(),
      PostsCategory.tableName()
    ].forEach((table) => {
      builder.addTableForTruncate(table);
    });

    for (let userId = 1; userId <= this._usersCount; userId++) {
      const role = userId === 1 ? `author` : `reader`;

      builder.addUser(User.create(userId), role);
    }

    this._categories.forEach((categoryName, index) => {
      const categoryId = index + 1;
      builder.addCategory(Category.create(categoryId, categoryName));
    });

    for (let postId = 1; postId <= this._postsCount; postId++) {
      const postsUserId = this._getRandomUserId();

      builder.addPost(Post.create(
          postId,
          this._getRandomPostTitle(),
          this._getRandomPostAnnounce(),
          this._getRandomPostText(),
          this._getRandomPostDate()
      ));

      for (let i = 0; i < getRandomInt(CommentsCount.MIN, CommentsCount.MAX); i++) {
        const commentAuthorId = this._getRandomUserExclude(postsUserId);
        builder.addPostsComment(PostsComment.create(
            this._commentCounter,
            this._getRandomCommentText(),
            postId,
            commentAuthorId
        ));

        ++this._commentCounter;
      }

      this._getRandomCategoriesIds().forEach((categoryId) => {
        builder.addPostsCategory(PostsCategory.create(postId, categoryId));
      });
    }
  }

  _getRandomUserId() {
    return getRandomInt(1, this._usersCount);
  }

  _getRandomCategoryId() {
    return getRandomInt(1, this._categoriesCount);
  }

  _getRandomUserExclude(userId) {
    const randomUserId = getRandomInt(1, this._usersCount);

    return userId === randomUserId ? this._getRandomUserExclude(userId) : randomUserId;
  }

  _getRandomCategoriesIds() {
    let categoriesIds = [];

    while (categoriesIds.length < getRandomInt(1, this._categoriesCount)) {
      const categoryId = this._getRandomCategoryId();

      if (categoriesIds.includes(categoryId)) {
        continue;
      }

      categoriesIds.push(categoryId);
    }

    return categoriesIds;
  }

  _getRandomCommentText() {
    return getRandomElement(this._commentText);
  }

  _getRandomPostTitle() {
    return getRandomElement(this._postsTitles);
  }

  _getRandomPostAnnounce() {
    return shuffleArray(this._sentences).slice(1, MaxValue.ANNOUNCE).join(` `);
  }

  _getRandomPostText() {
    return shuffleArray(this._sentences).slice(1, MaxValue.TEXT).join(` `);
  }

  _getRandomPostDate() {
    return moment(Date.now() - getRandomInt(0, (MONTH_MILLISECONDS * 3))).format(`YYYY-MM-DD HH:mm:ss`);
  }
}

module.exports = {
  async getCreator(offersCount) {

    const titles = (await readContent(FilePath.TITLES)).filter((title) => title.length > 0);
    const descriptions = (await readContent(FilePath.SENTENCES)).filter((description) => description.length > 0);
    const categoriesName = (await readContent(FilePath.CATEGORIES)).filter((category) => category.length > 0);
    const commentsText = (await readContent(FilePath.COMMENTS_TEXT)).filter((commentText) => commentText.length > 0);

    return new Creator(offersCount, categoriesName, commentsText, titles, descriptions);
  }
};
