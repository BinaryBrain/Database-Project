--List the 10 groups with the highest number of tracks that appear on compilations. A compilation is a 
--medium that contains tracks associated with more than one artist.
/*Count the number of tracks of an artist if the track is on a medium that contains at least an other track create by an other artist. 
Order the artists by their number of those track and finally select the top 10*/
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
SELECT A.ID_ARTIST AS ART_ID, A.NAME AS NAME, COUNT(DISTINCT T.ID_TRACK)
FROM ARTIST A, ARTIST_TRACK AT, TRACK T
WHERE A.TYPE='Group' AND A.ID_ARTIST=AT.ID_ARTIST AND AT.ID_TRACK=T.ID_TRACK AND T.ID_MEDIUM IN (SELECT DISTINCT T2.ID_MEDIUM
                                                                                                FROM ARTIST_TRACK AT2, TRACK T2, ARTIST_TRACK AT3, TRACK T3
                                                                                                WHERE AT2.ID_TRACK=T2.ID_TRACK AND AT3.ID_TRACK =T3.ID_TRACK
																								AND T2.ID_TRACK <>T3.ID_TRACK AND AT3.ID_ARTIST <>AT2.ID_ARTIST
																								AND T2.ID_MEDIUM=T3.ID_MEDIUM)
GROUP BY A.ID_ARTIST, A.NAME
ORDER BY COUNT(DISTINCT T.ID_TRACK)DESC
)WHERE ROWNUM<=10;
