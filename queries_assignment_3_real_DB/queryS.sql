--The concert hit index is a measure of probability that the artist can attract enough fans to fill a football 
--stadium. We define the “hit artist” as one that has more than 10 songs that appear on more than 100 
--mediums and measure "hit ability" as the average number of mediums that a top 10 song appears on. 
--List all “hit artists” according to their "hit ability". 
/*
First we select the recording that are on more than 3 mediums. Then for each artist that contribute to a recording 
that is in this subset(we have this information by using the precedent table in the from of this new query) we order 
them by the count of the medium. Then we 
*/

/*
ERREUR: pas ROW_NUMBER()OVER (PARTITION BY T.ID_RECORDING ORDER BY COUNTM DESC) AS RN? sinon on ordre les artistes par compte de
number de medium, pas très sensé?
*/
SELECT AID, AVG(COUNTM)
FROM(
SELECT A.ID_ARTIST AS AID, T.ID_RECORDING AS RECORD, COUNTM, ROW_NUMBER()OVER (PARTITION BY A.ID_ARTIST ORDER BY COUNTM DESC) AS RN  -- ARTIST QUI ONT PLUS DE 3 RECORDING (QUI ONT PLUS DE 3 MEDIUM)
FROM (
      SELECT T2.ID_RECORDING AS IDR, COUNT(DISTINCT T2.ID_MEDIUM) AS COUNTM --RECORDING QUI ONT PLUS QUE 3 MEDIUM
      FROM TRACK T2
      GROUP BY T2.ID_RECORDING
      HAVING COUNT(DISTINCT T2.ID_MEDIUM) >= 100 --REMPLACER PAR 100
) R3, ARTIST_TRACK AT, ARTIST A, TRACK T
WHERE A.ID_ARTIST = AT.ID_ARTIST AND AT.ID_TRACK = T.ID_TRACK AND T.ID_RECORDING = R3.IDR 
GROUP BY A.ID_ARTIST, T.ID_RECORDING, COUNTM
)
WHERE RN<=10
GROUP BY AID
HAVING COUNT(RECORD) = 10;