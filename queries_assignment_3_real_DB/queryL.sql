--For each area with more than 10 groups, list the 5 male artists that have recorded the highest number 
--of tracks.
/*
Select the areas that have more than 10 groups and for each of these areas select 
*/
/*
ERREUR ici on ne selectionne que une area qui respecte la condition des 10 groups pour display ses hommes mais normalement
plusieurs area sont sensées respecter ce critère non? Donc dans l'output on ne devrait pas avoir que 5 lignes mais un multiple
de 5?
*/
SELECT *
FROM (
SELECT A.NAME, A.ID_ARTIST
FROM ARTIST A, ARTIST_TRACK AT
WHERE A.ID_ARTIST = AT.ID_ARTIST AND A.ID_AREA IN ( 
  SELECT AR.ID_AREA
  FROM AREA AR, ARTIST A2
  WHERE AR.ID_AREA = A2.ID_AREA AND A2.TYPE = 'Group'
  GROUP BY AR.ID_AREA
  HAVING COUNT(DISTINCT A2.ID_ARTIST) > 10)
GROUP BY A.ID_ARTIST, A.NAME
ORDER BY COUNT(AT.ID_TRACK) DESC
)
WHERE ROWNUM <= 5;


