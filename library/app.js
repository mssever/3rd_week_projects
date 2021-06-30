'use strict';

let library;

class Book {
  constructor(isbn, title, author, read) {
    this.title = title;
    this.author = author;
    this.read = read;
    this.isbn = isbn
  }

  addToTable(row) {
    row.id = this.isbn;
    let title = row.children[0];
    let author = row.children[1];
    let isbn = row.children[2];
    let read = row.children[3];
    title.innerHTML = `<i>${this.title}</i>`;
    author.innerHTML = this.author;
    isbn.innerHTML = this.isbn;
    let input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.id = 'read' + this.isbn;
    input.setAttribute('name', 'read' + this.isbn);
    input.setAttribute('disabled', true);
    if(this.read) input.setAttribute('checked', true);
    read.innerHTML = '';
    read.appendChild(input);
  }

  print() {
    return `<i>${this.title}</i> by ${this.author}. Read: ${this.read}\tISBN: ${this.isbn}`;
  }
}

class Library {
  constructor() {
    this.book_count = 0;
    this.books = [];
    this.library_updated = new CustomEvent('library_updated', { detail: this});
    document.body.addEventListener('library_updated', evt => {
      update_html(evt.detail);
    });
  }

  addBook(book) {
    if(this.findByISBN(book.isbn) !== false) {
      throw new Error('Book already in library!');
    }
    this.books.push(book);
    this.book_count = this.books.length;
    document.body.dispatchEvent(this.library_updated);
  }

  findByISBN(isbn) {
    let result = this.books.find(book => book.isbn == isbn);
    return (typeof result == 'undefined') ? false : result;
  }

  print() {
    const out = []
    this.books.forEach(book => {
      out.push(book.print());
    });
    return out.join('\n');
  }
}

function update_html(library) {
  //alert('TODO: Add new books to table');
  // probably won't be used
  console.debug(library.print());
}

window.addEventListener('load', function () {
  library = new Library()
  let container = document.getElementById('data');
  let rows = container.children;
  for(let i=0; i<rows.length; i++) {
    let title = rows[i].children[0].textContent;
    let author = rows[i].children[1].textContent;
    let isbn = rows[i].children[2].textContent;
    let read = document.getElementById('read' + isbn).checked;
    library.addBook(new Book(isbn, title, author, read));
  }
  add_link();
});

function add_link() {
  let container = document.getElementById('data');
  let new_row = document.createElement('tr');
  let child1 = document.createElement('td');
  new_row.appendChild(child1);
  for(let i=0; i<3; i++) {
    new_row.appendChild(document.createElement('td'));
  }
  container.appendChild(new_row);
  let link = document.createElement('a');
  link.href = '#';
  link.setAttribute('onclick', 'add_row(this)');
  link.textContent = 'Add book';
  child1.appendChild(link);
}

function add_row(link) {
  function createElement(type, name, placeholder, label, input_type='text') {
    let input = document.createElement(type);
    input.setAttribute('type', input_type);
    input.setAttribute('name', name);
    input.id = name;
    input.setAttribute('placeholder', placeholder);
    input.setAttribute('aria-label', label);
    input.setAttribute('required', true)
    return input
  }

  let row = link.parentNode.parentNode;
  let title_cell = row.children[0];
  let author_cell = row.children[1];
  let isbn_cell = row.children[2];
  let read_cell = row.children[3];

  title_cell.innerHTML = '';

  let title = createElement('input', 'title', 'Title...', 'Enter the book\'s title');
  let author = createElement('input', 'author', 'Author...', 'Enter the author\'s name');
  let isbn = createElement('input', 'isbn', 'ISBN...', "Enter the books ISBN");
  let read = createElement('input', 'read', 'Read?', "Check this if you've read the book", 'checkbox');
  let submit = document.createElement('button');
  submit.setAttribute('type', 'submit');
  submit.textContent = 'Add';

  title_cell.appendChild(title);
  author_cell.appendChild(author);
  isbn_cell.appendChild(isbn);
  read_cell.appendChild(read);
  read_cell.appendChild(submit);

  submit.addEventListener('click', () => {
    let book = new Book(isbn.value, title.value, author.value, read.checked);
    library.addBook(book);
    book.addToTable(row);
    add_link();
    console.debug(library.print());
  })
}
