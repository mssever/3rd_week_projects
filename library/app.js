'use strict';

class Book {
  constructor(title, author, read) {
    this.title = title;
    this.author = author;
    this.read = read;
  }
}

class Library {
  constructor() {
    self.book_count = 0;
    self.books = [];
  }

  add_book(title, author, read=false) {}
}
