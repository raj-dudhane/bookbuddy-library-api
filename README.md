 BookBuddy – Book Library API

BookBuddy is a RESTful API that allows users to register, log in, and manage their personal book collection. Each book is linked to the user who added it.


# we use this technologies

 Node.js + Express
 MongoDB + Mongoose
 JWT for -authentication
 bcrypt for password hashing
 cookie-parser for session handling


# Testing Posman 
*user
1)Register a new user -> POST/books
2)Login user -> POST/login
3)Lgout user -> POST/logout

*books
1)add a new book -> POST/create
2)view all user books -> GET/view
3)update a book by ID -> PUT/update/:id
4)delete a book by ID -> DELETE/delete/:id

