# Sayit

A forum inspired by reddit.

## Live Site

https://cjsellwood.github.io/sayit

## Front-end

https://github.com/cjsellwood/sayit

## Back-end Technologies

- Node
- Express
- SQL/PostgreSQL
- Passport
- Heroku

## Back-end Features

* Authentication is handled by issuing a jwt token when a user registers or logs in. Using passport, the jwt is verified for protected routes.
* Lists of posts are returned based upon the query string provided by the user on the front-end.
* Request containing body parameters are are verified using joi.
* The database is separated into tables of users, topics, posts, comments and votes. Joins are used to link data for return to front-end and subqueries are used to get vote data for each post.
* The database can be reset then recreated and seeded with placeholder data.
* Errors are dealt with by throwing within routes and handling in a central location which sends the error to the front-end.
* The live server is hosted with heroku and their postgreSQL database addon. This can cause slow initial requests and also limits database to 10,000 rows.
