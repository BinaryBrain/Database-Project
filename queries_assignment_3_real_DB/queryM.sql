--List the 10 groups with the highest number of tracks that appear on compilations. A compilation is a 
--medium that contains tracks associated with more than one artist.
/*
Select an artist A1 and see if on one of the medium he did an artist A2 has 
also done one track (or more but one is sufficient to respect the compilation criteria). 
Then order all the artist that respect this condition by their number of tracks and select the top 10 of them.
*/
/*SELECT NAME
FROM(
SELECT A.NAME AS NAME
FROM ARTIST A, ARTIST_TRACK AT, TRACK T, ARTIST_TRACK AT2, TRACK T2
WHERE A.TYPE='Group' AND AT.ID_ARTIST=A.ID_ARTIST AND T.ID_TRACK=AT.ID_TRACK AND T.ID_MEDIUM=T2.ID_MEDIUM AND AT2.ID_TRACK=T2.ID_TRACK AND AT2.ID_ARTIST <> AT.ID_ARTIST
GROUP BY A.ID_ARTIST, A.NAME
ORDER BY COUNT(DISTINCT T.ID_TRACK) DESC
)WHERE ROWNUM<=10;*/
SELECT *
FROM(
SELECT A.NAME AS NAME, COUNT(DISTINCT T.ID_TRACK)
FROM ARTIST A, ARTIST_TRACK AT, TRACK T
WHERE A.TYPE='Group' AND A.ID_ARTIST=AT.ID_ARTIST AND AT.ID_TRACK=T.ID_TRACK AND T.ID_MEDIUM IN (SELECT T2.ID_MEDIUM
                                                                                                FROM ARTIST_TRACK AT2, TRACK T2
                                                                                                WHERE AT2.ID_TRACK=T2.ID_TRACK
                                                                                                GROUP BY T2.ID_MEDIUM
                                                                                                HAVING COUNT(DISTINCT AT2.ID_ARTIST)>=2)
GROUP BY A.ID_ARTIST, A.NAME
ORDER BY COUNT(DISTINCT T.ID_TRACK)DESC
)WHERE ROWNUM<=10;
