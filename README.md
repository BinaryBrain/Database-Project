Database-Project
================

Introduction
------------

The goal of this EPFL projet was to manage a quite big database via a graphical interface. We acheive that by doing a web server to link the database with the user web interface.

Another big challange was to create a lot of complex SQL queries.

![screenshot](screenshots/search.png?raw=true)

_Oh! By the way, we had 100/100 points. =D_
How to Run
----------

1) Make sure you're connected on the EPFL network

2) Launch the Java server with the following commands:

On Windows:

```
cd server
mkdir bin
javac -cp "bin;lib/ojdbc7.jar" -d bin src/database/* src/webServer/*
java -cp "bin/;lib/ojdbc7.jar" webServer.WebServer
```

On Linux/MacOS:

```
cd server
mkdir bin
javac -cp bin:lib/ojdbc7.jar -d bin src/database/* src/webServer/*
java -cp bin:lib/ojdbc7.jar webServer.WebServer

```

3) Go to [localhost:7123](http://localhost:7123/)

Git Setup
---------

Extract [Music.zip](http://diaswww.epfl.ch/courses/db2014/project/Music.zip) in the main folder to have something like this `Database-Project/ProjectData/*.csv`. This folder is gitignored.


Server Response (JSON)
----------------------

### Success

```
{
	"status": "OK",
	"data": [
		{ "ID_ARTIST": "1", "NAME": "The xx" },
		{ "ID_ARTIST": "2", "NAME": "Camilla Sparksss", "AREA": "Switzerland" }
	]
}
```

### Error

```
{
	"status": "Error",
	"error": "I'm a teapot."
}
```
