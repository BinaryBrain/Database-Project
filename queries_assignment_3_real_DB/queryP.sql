--List the most popular genre among the groups which are associated with at least 3 genres. 
/*
First we select the genre that contains a group which have 2 other genres. Then we check that each of these genre 
is different from each other. Finally we select of the genre that match this condition by ordering them by their number
of artist and select the top 1.
*/
SELECT GNAME
FROM (
SELECT G.NAME AS GNAME
FROM GENRE G, ARTIST_GENRE AG
WHERE G.ID_GENRE=AG.ID_GENRE AND AG.ID_ARTIST IN(
SELECT A.ID_ARTIST
FROM ARTIST A, ARTIST_GENRE AG, ARTIST_GENRE AG2, ARTIST_GENRE AG3
WHERE A.TYPE = 'Group' AND AG.ID_ARTIST = A.ID_ARTIST AND  AG2.ID_ARTIST = A.ID_ARTIST AND  AG3.ID_ARTIST = A.ID_ARTIST 
AND AG.ID_GENRE <> AG2.ID_GENRE AND AG2.ID_GENRE <> AG3.ID_GENRE AND AG3.ID_GENRE <> AG.ID_GENRE)
GROUP BY G.ID_GENRE, G.NAME
ORDER BY COUNT(DISTINCT AG.ID_ARTIST) DESC

) WHERE ROWNUM <= 1