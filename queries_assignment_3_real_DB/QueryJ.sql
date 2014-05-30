--For each of the 10 genres with the most artists, list the female artist that has recorded the highest 
--number of tracks. 
SELECT NAME
FROM(
  SELECT AG.ID_GENRE, A.NAME AS NAME, COUNT(DISTINCT AT.ID_TRACK), ROW_NUMBER()OVER (PARTITION BY AG.ID_GENRE ORDER BY COUNT(DISTINCT AT.ID_TRACK) DESC) AS RN
  FROM ARTIST A, ARTIST_TRACK AT, ARTIST_GENRE AG
  WHERE A.ID_ARTIST= AT.ID_ARTIST  AND A.GENDER='Female' AND A.ID_ARTIST=AG.ID_ARTIST AND AG.ID_GENRE IN (SELECT *
                                                                                                          FROM(
                                                                                                          SELECT G.ID_GENRE
                                                                                                          FROM ARTIST_GENRE G
                                                                                                          GROUP BY G.ID_GENRE
                                                                                                          ORDER BY COUNT(DISTINCT G.ID_ARTIST) DESC)
                                                                                                          WHERE ROWNUM <=10)
  GROUP BY AG.ID_GENRE, A.ID_ARTIST, A.NAME
  )
WHERE RN=1;

