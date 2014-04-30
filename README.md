Database-Project
================

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
		{ "ID_ARTIST": "2", "NAME": "Camillia Sparksss", "AREA": "Switzerland" }
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
