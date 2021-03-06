--The concert hit index is a measure of probability that the artist can attract enough fans to fill a football 
--stadium. We define the �hit artist� as one that has more than 10 songs that appear on more than 100 
--mediums and measure "hit ability" as the average number of mediums that a top 10 song appears on. 
--List all �hit artists� according to their "hit ability". 
SELECT AID, AVG(COUNTM)
FROM(
SELECT A.ID_ARTIST AS AID, T.ID_RECORDING AS RECORD, COUNTM, ROW_NUMBER()OVER (PARTITION BY A.ID_ARTIST ORDER BY COUNTM DESC) AS RN  -- ARTIST QUI ONT PLUS DE 3 RECORDING (QUI ONT PLUS DE 3 MEDIUM)
FROM (
      SELECT T2.ID_RECORDING AS IDR, COUNT(DISTINCT T2.ID_MEDIUM) AS COUNTM --RECORDING QUI ONT PLUS QUE 3 MEDIUM
      FROM DUMMY_TRACK T2
      GROUP BY T2.ID_RECORDING
      HAVING COUNT(DISTINCT T2.ID_MEDIUM) >= 3 --REMPLACER PAR 100
) R3, DUMMY_ARTIST_TRACK AT, DUMMY_ARTIST A, DUMMY_TRACK T
WHERE A.ID_ARTIST = AT.ID_ARTIST AND AT.ID_TRACK = T.ID_TRACK AND T.ID_RECORDING = R3.IDR 
GROUP BY A.ID_ARTIST, T.ID_RECORDING, COUNTM
)
WHERE RN<=3
GROUP BY AID
HAVING COUNT(RECORD) = 3;