/* List the top 10 artists according to their track-to-release ratio. This ratio is computed by dividing the 
number of tracks an artist is associated with by the number of releases this artist has contributed a track 
to. */

SELECT *
FROM (
SELECT A.NAME, COUNT(DISTINCT T.ID_TRACK) / COUNT(DISTINCT M.ID_RELEASE) AS RATIO
FROM ARTIST A, ARTIST_TRACK AT, TRACK T, MEDIUM M
WHERE A.ID_ARTIST = AT.ID_ARTIST AND AT.ID_TRACK = T.ID_TRACK AND T.ID_MEDIUM = M.ID_MEDIUM
GROUP BY A.ID_ARTIST, A.NAME
ORDER BY RATIO DESC
)
WHERE ROWNUM <= 10;
