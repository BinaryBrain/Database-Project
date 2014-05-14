/*List the top 10 releases with the most collaborations, i.e., releases where one artist is performing all 
songs and the highest number of different guest artists contribute to the album. */


/* the highest number of different guest artists contribute to the album.*/
/*
SELECT R.ID_RELEASE
FROM DUMMY_RELEASE R, DUMMY_MEDIUM M, DUMMY_TRACK T, DUMMY_ARTIST_TRACK AT
WHERE R.ID_RELEASE = M.ID_RELEASE AND M.ID_MEDIUM = T.ID_MEDIUM AND 
T.ID_TRACK = AT.ID_TRACK AND R.ID_RELEASE IN (
SELECT 
)
GROUP BY R.ID_RELEASE
ORDER BY COUNT(UNIQUE AT.ID_ARTIST) DESC*/

SELECT R.ID_RELEASE, T.ID_TRACK, AT.ID_ARTIST
FROM DUMMY_RELEASE R, DUMMY_MEDIUM M, DUMMY_TRACK T, DUMMY_ARTIST_TRACK AT
WHERE R.ID_RELEASE = M.ID_RELEASE AND M.ID_MEDIUM = T.ID_MEDIUM AND 
T.ID_TRACK = AT.ID_TRACK
ORDER BY R.ID_RELEASE, T.ID_TRACK, AT.ID_ARTIST
