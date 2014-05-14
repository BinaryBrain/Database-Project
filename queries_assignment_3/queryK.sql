/*List all genres that have no female artists, all genres that have no male artists and all genres that have 
no groups. */
                                        
/*SELECT UNIQUE G.NAME
FROM DUMMY_GENRE G, DUMMY_ARTIST_GENRE AG
WHERE G.ID_GENRE = AG.ID_GENRE AND AG.ID_ARTIST NOT IN (SELECT COUNT(A.ID_ARTIST)
                                        FROM DUMMY_ARTIST A
                                        WHERE A.GENDER = 'Female')*/

/* see: Find all sailors who have not reserved a 
red boat in sql course*/
                                        
SELECT G.ID_GENRE
FROM DUMMY_GENRE G
WHERE G.ID_GENRE
NOT IN
(SELECT AG.ID_GENRE
FROM DUMMY_ARTIST_GENRE AG, DUMMY_ARTIST A
WHERE AG.ID_ARTIST = A.ID_ARTIST AND A.GENDER = 'Female')

UNION 

SELECT G.ID_GENRE
FROM DUMMY_GENRE G
WHERE G.ID_GENRE
NOT IN
(SELECT AG.ID_GENRE
FROM DUMMY_ARTIST_GENRE AG, DUMMY_ARTIST A
WHERE AG.ID_ARTIST = A.ID_ARTIST AND A.GENDER = 'Male')

UNION 

SELECT G.ID_GENRE
FROM DUMMY_GENRE G
WHERE G.ID_GENRE
NOT IN
(SELECT AG.ID_GENRE
FROM DUMMY_ARTIST_GENRE AG, DUMMY_ARTIST A
WHERE AG.ID_ARTIST = A.ID_ARTIST AND A.TYPE = 'Group')
