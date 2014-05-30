--List the 10 groups with the highest number of tracks that appear on compilations. A compilation is a 
--medium that contains tracks associated with more than one artist.



SELECT NAME
FROM(
SELECT A.NAME AS NAME, COUNT(DISTINCT T.ID_TRACK) AS COUNTA
FROM ARTIST A, ARTIST_TRACK AT, TRACK T, ARTIST_TRACK AT2, TRACK T2
WHERE A.TYPE='Group' AND AT.ID_ARTIST=A.ID_ARTIST AND T.ID_TRACK=AT.ID_TRACK AND T.ID_MEDIUM=T2.ID_MEDIUM AND AT2.ID_TRACK=T2.ID_TRACK AND AT2.ID_ARTIST <> AT.ID_ARTIST
GROUP BY A.ID_ARTIST, A.NAME
ORDER BY COUNT(DISTINCT T.ID_TRACK) DESC
)WHERE ROWNUM<=10;