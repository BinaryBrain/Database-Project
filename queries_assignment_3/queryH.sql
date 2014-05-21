/*For each area that has more than 30 artists, list the male artist, the female artist and the group with the 
most tracks recorded. */

/*SELECT AR.ID_AREA
FROM DUMMY_AREA AR
WHERE (SELECT COUNT(DISTINCT A.ID_ARTIST)
FROM DUMMY_ARTIST A
WHERE A.ID_AREA = AR.ID_AREA) > 3*/

/*(SELECT *
FROM(SELECT A1.ID_ARTIST
FROM DUMMY_ARTIST A1, DUMMY_ARTIST_TRACK AT, DUMMY_AREA A
WHERE A1.ID_ARTIST = AT.ID_ARTIST AND A.ID_AREA = A1.ID_AREA
GROUP BY A1.ID_ARTIST
ORDER BY COUNT(DISTINCT AT.ID_TRACK) DESC)
WHERE ROWNUM = 1)*/

/*
SELECT AR.ID_AREA AS AREA, 
(
  (SELECT *
  FROM(
    SELECT A1.NAME
    FROM DUMMY_ARTIST A1, DUMMY_ARTIST_TRACK AT, DUMMY_AREA AR
    WHERE A1.ID_ARTIST = AT.ID_ARTIST AND AR.ID_AREA = A1.ID_AREA AND AR.GENDER = 'Male'
    GROUP BY A1.ID_ARTIST, A1.NAME
    ORDER BY COUNT(DISTINCT AT.ID_TRACK) DESC
  )
  WHERE ROWNUM = 1)) AS MALE
FROM DUMMY_AREA AR
WHERE (SELECT COUNT(DISTINCT A.ID_ARTIST)
FROM DUMMY_ARTIST A
WHERE A.ID_AREA = AR.ID_AREA) > 3*/

SELECT AR.ID_AREA AS AREA, 
  (SELECT *
   FROM 
        (SELECT A1.ID_ARTIST
         FROM DUMMY_ARTIST A1, DUMMY_ARTIST_TRACK AT
         WHERE A1.ID_ARTIST = AT.ID_ARTIST AND AR.ID_AREA = A1.ID_AREA
         GROUP BY A1.ID_ARTIST
         ORDER BY COUNT(DISTINCT AT.ID_TRACK) DESC)
    WHERE ROWNUM = 1) AS MALE_TRACK
FROM DUMMY_AREA AR;
SELECT NAME_F AS AREA, ANAME_F AS FEMALE_ARTIST,ANAME_M AS MALE_ARTIST, ANAME_G AS GROUP_ARTIST
FROM(
SELECT NAME_F, ANAME_F
FROM(
SELECT AR.NAME AS NAME_F, A.NAME AS ANAME_F, ROW_NUMBER()OVER(PARTITION BY AR.ID_AREA, AR.NAME ORDER BY COUNT(DISTINCT A.ID_ARTIST)) AS RN 
FROM DUMMY_ARTIST A, DUMMY_AREA AR, DUMMY_ARTIST_TRACK AT
WHERE A.GENDER='Female' AND A.ID_AREA=AR.ID_AREA AND A.ID_ARTIST=AT.ID_ARTIST AND A.ID_AREA IN (SELECT AR.ID_AREA
                                                                                                FROM DUMMY_ARTIST AR
                                                                                                GROUP BY AR.ID_AREA
                                                                                               HAVING COUNT(DISTINCT AR.ID_ARTIST)>1
                                                                                                  )
GROUP BY AR.ID_AREA, AR.NAME, A.ID_ARTIST, A.NAME
ORDER BY COUNT(DISTINCT A.ID_ARTIST)
)
WHERE RN=1), 
(SELECT NAME_M, ANAME_M
FROM(
SELECT AR.NAME AS NAME_M, A.NAME AS ANAME_M, ROW_NUMBER()OVER(PARTITION BY AR.ID_AREA, AR.NAME ORDER BY COUNT(DISTINCT A.ID_ARTIST)) AS RN 
FROM DUMMY_ARTIST A, DUMMY_AREA AR, DUMMY_ARTIST_TRACK AT
WHERE A.GENDER='Male' AND A.ID_AREA=AR.ID_AREA AND A.ID_ARTIST=AT.ID_ARTIST AND A.ID_AREA IN (SELECT AR.ID_AREA
                                                                                                FROM DUMMY_ARTIST AR
                                                                                                GROUP BY AR.ID_AREA
                                                                                               HAVING COUNT(DISTINCT AR.ID_ARTIST)>1
                                                                                                  )
GROUP BY AR.ID_AREA, AR.NAME, A.ID_ARTIST, A.NAME
ORDER BY COUNT(DISTINCT A.ID_ARTIST)
)
WHERE RN=1), (SELECT NAME_G, ANAME_G
FROM(
SELECT AR.NAME AS NAME_G, A.NAME AS ANAME_G, ROW_NUMBER()OVER(PARTITION BY AR.ID_AREA, AR.NAME ORDER BY COUNT(DISTINCT A.ID_ARTIST)) AS RN 
FROM DUMMY_ARTIST A, DUMMY_AREA AR, DUMMY_ARTIST_TRACK AT
WHERE A.TYPE='Group' AND A.ID_AREA=AR.ID_AREA AND A.ID_ARTIST=AT.ID_ARTIST AND A.ID_AREA IN (SELECT AR.ID_AREA
                                                                                                FROM DUMMY_ARTIST AR
                                                                                                GROUP BY AR.ID_AREA
                                                                                               HAVING COUNT(DISTINCT AR.ID_ARTIST)>1
                                                                                                  )
GROUP BY AR.ID_AREA, AR.NAME, A.ID_ARTIST, A.NAME
ORDER BY COUNT(DISTINCT A.ID_ARTIST)
)
WHERE RN=1) GR
WHERE NAME_F=NAME_M AND NAME_G=NAME_F;


