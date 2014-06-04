--List the top 10 artists according to their track-to-release ratio. This ratio is computed by dividing the 
--number of tracks an artist is associated with by the number of releases this artist has contributed a track 
--to.
/*
For each artist we compute his ratio, we order all the artists by it and we select the top 10 of them.
*/
/*
SELECT *
FROM (
SELECT A.NAME, COUNT(DISTINCT T.ID_TRACK) / COUNT(DISTINCT M.ID_RELEASE) AS RATIO
FROM ARTIST A, ARTIST_TRACK AT, TRACK T, MEDIUM M
WHERE A.ID_ARTIST = AT.ID_ARTIST AND AT.ID_TRACK = T.ID_TRACK AND T.ID_MEDIUM = M.ID_MEDIUM
GROUP BY A.ID_ARTIST, A.NAME
ORDER BY RATIO DESC
)
WHERE ROWNUM <= 10;*/

SELECT *
FROM(
SELECT A.ID_ARTIST, A.NAME, COUNT_TRACK/COUNT_RELEASE AS RATIO
FROM
(SELECT  AT.ID_ARTIST AS ART_ID, COUNT(DISTINCT AT.ID_TRACK) AS COUNT_TRACK
FROM ARTIST_TRACK AT
GROUP BY AT.ID_ARTIST) TR, (SELECT AT.ID_ARTIST AS ART_ID, COUNT(DISTINCT M.ID_RELEASE) AS COUNT_RELEASE
                            FROM ARTIST_TRACK AT, TRACK T, MEDIUM M
                            WHERE AT.ID_TRACK=T.ID_TRACK AND T.ID_MEDIUM=M.ID_MEDIUM
                            GROUP BY AT.ID_ARTIST) ME, ARTIST A
                            
WHERE A.ID_ARTIST=TR.ART_ID AND A.ID_ARTIST =ME.ART_ID
ORDER BY RATIO DESC
)WHERE ROWNUM <=10;


