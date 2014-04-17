
CREATE TABLE Area(
ID_Area CHAR(60),
Name CHAR(60),
Type CHAR(60),
PRIMARY KEY(ID_Area)
);

CREATE TABLE Genre
(ID_Genre CHAR(60),
Name CHAR(60),
Count CHAR(60),
PRIMARY KEY(ID_Genre));

CREATE TABLE Recording
(ID_Recording CHAR(60),
Name CHAR(60),
Length CHAR(60),
PRIMARY KEY(ID_Recording));

CREATE TABLE Release
(ID_Release CHAR(60),
Name CHAR(60),
PRIMARY KEY(ID_Release));

CREATE TABLE Artist
(ID_Artist CHAR(60),
Name CHAR(60),
Type CHAR(60),
Gender CHAR(60),
ID_Area CHAR(60),
PRIMARY KEY(ID_Artist),
FOREIGN KEY(ID_Area) REFERENCES Area
);

CREATE TABLE Medium
(ID_Medium CHAR(60),
Format CHAR(60),
ID_Release CHAR(60),
PRIMARY KEY(ID_Medium),
FOREIGN KEY(ID_Release) REFERENCES Release);

CREATE TABLE Track
(ID_Track CHAR(60),
Position CHAR(60),
ID_Medium CHAR(60),
ID_Recording CHAR(60),
PRIMARY KEY(ID_Track),
FOREIGN KEY(ID_Medium) REFERENCES Medium,
FOREIGN KEY(ID_Recording) REFERENCES Recording
);

CREATE TABLE Artist_Genre
(ID_Artist CHAR(60),
ID_Genre CHAR(60),
PRIMARY KEY(ID_Artist, ID_Genre),
FOREIGN KEY(ID_Artist) REFERENCES Artist,
FOREIGN KEY(ID_Genre) REFERENCES Genre);

CREATE TABLE Artist_Track
(ID_Artist CHAR(60),
ID_Track CHAR(60),
PRIMARY KEY(ID_Artist, ID_Track),
FOREIGN KEY(ID_Artist) REFERENCES Artist,
FOREIGN KEY(ID_Track) REFERENCES Track);