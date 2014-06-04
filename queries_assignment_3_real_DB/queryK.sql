--List all genres that have no female artists, all genres that have no male artists and all genres that have 
--no groups.
                                        
/*
Select the genres that are not present in the result of the selection of genres that have female artist.
Select the genres that are not present in the result of the selection of genres that have male artist.
Select the genres that are not present in the result of the selection of genres that have group artist.
Union the results of each of these subqueries.
*/

SELECT G.ID_GENRE, G.NAME
FROM GENRE G
WHERE G.ID_GENRE
NOT IN
(SELECT AG.ID_GENRE
FROM ARTIST_GENRE AG, ARTIST A
WHERE AG.ID_ARTIST = A.ID_ARTIST AND A.GENDER = 'Female')

UNION 

SELECT G.ID_GENRE, G.NAME
FROM GENRE G
WHERE G.ID_GENRE
NOT IN
(SELECT AG.ID_GENRE
FROM ARTIST_GENRE AG, ARTIST A
WHERE AG.ID_ARTIST = A.ID_ARTIST AND A.GENDER = 'Male')

UNION 

SELECT G.ID_GENRE, G.NAME
FROM GENRE G
WHERE G.ID_GENRE
NOT IN
(SELECT AG.ID_GENRE
FROM ARTIST_GENRE AG, ARTIST A
WHERE AG.ID_ARTIST = A.ID_ARTIST AND A.TYPE = 'Group');
