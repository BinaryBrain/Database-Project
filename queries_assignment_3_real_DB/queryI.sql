--American metal group Metallica is asking its fans to choose the setlist for its upcoming concert in 
--Switzerland. Assuming that the Metallica fans will choose the songs that have appeared on the highest 
--number of mediums, list the top 25 songs. 
/*
Order the recordings of Metallica by the count of their mediums apparitions 
in the track table and select the top 25 of them  
*/
SELECT DISTINCT *
FROM
(SELECT R.NAME
FROM TRACK T, RECORDING R, ARTIST_TRACK AT, ARTIST A
WHERE A.NAME = 'Metallica' AND A.ID_ARTIST = AT.ID_ARTIST AND AT.ID_TRACK = T.ID_TRACK AND T.ID_RECORDING = R.ID_RECORDING
GROUP BY R.ID_RECORDING, R.NAME
ORDER BY COUNT(T.ID_MEDIUM) DESC)
WHERE ROWNUM <= 25;