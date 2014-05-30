Database-Project
================

![screenshot](screenshots/search.png?raw=true)

Run
---

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
javac -cp "bin:lib/ojdbc7.jar" -d bin src/database/* src/webServer/*
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
