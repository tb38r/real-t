package db

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

const dbName = "real-time-forum.db"

func CreateDB() {
	var db *sql.DB
	db, err := sql.Open("sqlite3", dbName)
	if err != nil {

		log.Fatal(err)
	}

	_, err1 := db.Exec(`create table if not exists users (
		userID integer primary key AUTOINCREMENT, 
		username CHAR(50), 
		email CHAR(50), 
		firstname CHAR(50), 
		lastname CHAR(50), 
		hash CHAR(50),
		age integer);`)
	fmt.Println("err1", err1)

	_, err2 := db.Exec(`create table if not exists posts (
			postID integer primary key AUTOINCREMENT, 
			userID integer REFERENCES users(userID), 
			creationDate integer,
			postTitle CHAR(50),
			postContent CHAR(250), 
			image CHAR(100), 
			edited integer);`)
	fmt.Println("err2", err2)

	_, err3 := db.Exec(`create table if not exists comments (
			commentID integer primary key AUTOINCREMENT, 
			userID integer REFERENCES users(userID), 
			postID integer REFERENCES post(postID), 
			commentText CHAR(250), 
			edited integer, 
			creationDate integer,
			notified integer,
			creatorID integer);`)
	fmt.Println("err3", err3)

	_, err4 := db.Exec(`create table if not exists messages(
		messageID integer PRIMARY KEY AUTOINCREMENT, 
		message CHAR(250),
	    sender text REFERENCES users(username), 
		recepient text REFERENCES users(username),
		creationDate integer);`)
	fmt.Println("err4", err4)
}
