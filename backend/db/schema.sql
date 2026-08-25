CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password1 TEXT NOT NULL
)

/* 
this will create  users
- user_id
- username
- email
- password (hashed)
*/