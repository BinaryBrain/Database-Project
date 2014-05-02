Database-Project
================

![screenshot](https://raw.githubusercontent.com/BinaryBrain/Database-Project/master/screenshots/search.png?token=1102077__eyJzY29wZSI6IlJhd0Jsb2I6QmluYXJ5QnJhaW4vRGF0YWJhc2UtUHJvamVjdC9tYXN0ZXIvc2NyZWVuc2hvdHMvc2VhcmNoLnBuZyIsImV4cGlyZXMiOjEzOTk2NDk5MjF9--e84ac35772be4884364898ac78b35eeaa92535c2)

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
