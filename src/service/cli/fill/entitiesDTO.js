'use strict';

module.exports = class EntitiesDTO {
  constructor() {
    this._truncateTables = [];
    this._users = [];
    this._posts = [];
    this._categories = [];
    this._postsComments = [];
    this._postsCategories = [];
  }

  addTableForTruncate(table) {
    this._truncateTables.push(table);
  }

  addUser(user) {
    this._users.push(user);
  }

  addPost(offer) {
    this._posts.push(offer);
  }

  addPostsComment(offersComment) {
    this._postsComments.push(offersComment);
  }

  addCategory(category) {
    this._categories.push(category);
  }

  addPostsCategory(offersCategory) {
    this._postsCategories.push(offersCategory);
  }

  getTablesForTruncate() {
    return this._truncateTables;
  }

  get users() {
    return this._users;
  }

  get posts() {
    return this._posts;
  }

  get postsComments() {
    return this._postsComments;
  }

  get categories() {
    return this._categories;
  }

  get postsCategories() {
    return this._postsCategories;
  }
};
