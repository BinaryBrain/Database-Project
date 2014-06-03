--The concert hit index is a measure of probability that the artist can attract enough fans to fill a football 
--stadium. We define the “hit artist” as one that has more than 10 songs that appear on more than 100 
--mediums and measure "hit ability" as the average number of mediums that a top 10 song appears on. 
--List all “hit artists” according to their "hit ability". 
/*
First we select the recording that are on more than 3 mediums. Then for each artist that contribute to a recording 
that is in this subset(we have this information by using the precedent table in the from of this new query) we order 
them by the count of the medium. Then we choose the 10 first recording with the highest number of medium for each artist.
*/


SELECT ART_ID, AVG(COUNTM)
FROM(
  SELECT AT.ID_ARTIST AS ART_ID,  R.NAME AS RECORD_NAME, COUNT(DISTINCT T.ID_MEDIUM) AS COUNTM
  FROM DUMMY_ARTIST_TRACK AT, DUMMY_RECORDING R, DUMMY_TRACK T
  WHERE T.ID_RECORDING=R.ID_RECORDING  AND AT.ID_TRACK=T.ID_TRACK                                               
  GROUP BY AT.ID_ARTIST, R.NAME
  HAVING COUNT(DISTINCT T.ID_MEDIUM)>=100
)GROUP BY ART_ID
HAVING COUNT(RECORD_NAME)>=10;



