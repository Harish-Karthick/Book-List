class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {

  addBookToList(book) {
    const list = document.getElementById('book-list');

    //Create a table row element
    const row = document.createElement('tr');

    //Insert columns
    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href = "#" class = "delete">X</a></td>
      `;

    list.appendChild(row);
  }

  showAlert(message, className) {

    //Create a div
    const div = document.createElement('div');

    //div class
    div.className = `alert ${className}`;

    //Add text
    div.appendChild(document.createTextNode(message));

    //Get a parent
    const container = document.querySelector('.container');

    const form = document.querySelector('#book-form');

    //Insert alert after the container
    container.insertBefore(div, form);

    //Hide alert after 3 second
    setTimeout(function () {
      document.querySelector('.alert').remove();
    }, 3000);

  }

  deleteBook(target) {
    if (target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
  }

  clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';

  }
}

//Local Storage Class
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(function (book) {
      const ui = new UI;

      //Add Book to UI
      ui.addBookToList(book);
    });

  }

  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach(function (book, index) {
      const ui = new UI;

      //Add Book to UI
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));

  }

}

//DOM load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks());

//Event Listerner for submit
document.getElementById('book-form').addEventListener('submit',
  function (e) {

    //Get Form values
    const title = document.getElementById('title').value,
      author = document.getElementById('author').value,
      isbn = document.getElementById('isbn').value;

    //Creating the book instance
    const book = new Book(title, author, isbn);

    //Instantiate a UI object
    const ui = new UI();

    //Validate
    if (title === '' ||
      author === '' ||
      isbn === '') {

      //Error Alert
      ui.showAlert('Please fill in all the fields', 'error')

    } else {

      //Add book to list
      ui.addBookToList(book);

      //Add to local storage
      Store.addBook(book);

      //Clear Fields
      ui.clearFields();

      //Show alert for success
      ui.showAlert('Book added successfully', 'success')
    }

    e.preventDefault();
  });

//Event Listener for delete
document.getElementById('book-list').addEventListener('click', function (e) {

  //instantiate a new UI object
  const ui = new UI();

  //call the delete ui function
  ui.deleteBook(e.target);

  //Remove from local storage
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  //Show message
  ui.showAlert('Book removed successfully', 'success');

  e.preventDefault();
});