class BookOnReadingListError extends Error {
  constructor(message = "Book is already on your reading list.") {
    super(message);
    this.statusCode = 400;
  }
}

class UnauthorizedError extends Error {
  constructor(message = "Not Authorized.") {
    super(message);
    this.statusCode = 401;
  }
}

class UserInputError extends Error {
  constructor(message = "Invalid Input.") {
    super(message);
    this.statusCode = 400;
  }
}

export { BookOnReadingListError, UnauthorizedError, UserInputError };
