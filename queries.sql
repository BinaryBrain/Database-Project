--A print the name of artist from switzerland
SELECT A.name
FROM Artist A, Area B
WHERE A.ID_AREA = B.ID_AREA AND B.name= 'Switzerland'

--B print the name and the number of female, male and group of the area that have the most artist of this gender
SELECT B.name, Count(A1.ID), Count(A2.ID), Count(A3.ID)
FROM Area B, Artist A, Artist A1, Artist A2, Artist A3
WHERE (SELECT Count(A.name)
	   WHERE A.ID_AREA=B.ID_AREA AND A.gender ='female') >= ALL(SELECT Count(*)
								FROM Area B1, Artist A1
								WHERE B1.ID_AREA <> B.ID_AREA AND A1.ID_AREA=B1.ID_AREA AND A1.gender= 'female') OR
	   (SELECT Count(A.name)
	   WHERE A.ID_AREA=B.ID_AREA AND A.gender ='male') >= ALL(SELECT Count(*)
																FROM Area B1, Artist A1
																WHERE B1.ID_AREA <> B.ID_AREA AND A1.ID_AREA=B1.ID_AREA AND A1.gender= 'male')  OR
	(SELECT Count(A.name)
	  WHERE A.ID_AREA=B.ID_AREA AND A.gender ='group') >= ALL(SELECT Count(*)
																FROM Area B1, Artist A1
																WHERE B1.ID_AREA <> B.ID_AREA AND A1.ID_AREA=B1.ID_AREA AND A1.gender= 'group')
GROUP BY B.ID_AREA
HAVING A1.gender='female' AND A2.gender='male' AND A3.gender='group'


--C List the name of 10 groups with the most recorded track
SELECT *
FROM(SELECT A.NAME
	FROM  DUMMY_Artist A, DUMMY_Artist_Track S
	WHERE A.ID_ARTIST=S.ID_ARTIST AND A.TYPE='Group'
	GROUP BY A.NAME
	ORDER BY count(S.ID_TRACK) DESC)
WHERE ROWNUM <=10

--D List the name of 10 groups with the most release
SELECT *
FROM(SELECT A.NAME
	FROM Artist A, Track T, Artist_Track S, Medium M, Release R
	WHERE A.ID_ARTIST =S.ID_ARTIST AND T.ID_TRACK=S.ID_TRACK
AND T.ID_MEDIUM=M.ID_MEDIUM AND R.ID_RELEASE = M.ID_RELEASE
AND A.TYPE='Group'
	GROUP BY A.NAME
	ORDER BY count(R.ID_RELEASE) DESC)
WHERE ROWNUM <=10

--E Print the name of female artist that have the most genres
SELECT NAME
FROM (SELECT A.NAME AS NAME, COUNT(DISTINCT G.ID_GENRE) AS COUNT_GENRE
      FROM ARTIST_GENRE G, ARTIST A
      WHERE A.ID_ARTIST= G.ID_ARTIST AND A.GENDER='Female'
      GROUP BY A.NAME
      ORDER BY COUNT_GENRE DESC
      )
WHERE ROWNUM=1;

--F Print the name of the cities that have more female artist than male artist										
SELECT B.name
FROM Area B
WHERE B.type='City' AND (SELECT Count(*)
				    FROM Artist A
				    WHERE A.gender='Female' 
    AND A.ID_AREA= B.ID_AREA) 
    > (SELECT Count(*)
					  FROM Artist A1
					  WHERE A1.gender='Male' 
  AND A1.ID_AREA=B.ID_AREA)

																		WHERE A1.gender='male' AND A1.ID_AREA=B.ID_AREA )
--G List the release with the most number of tracks
SELECT NAME
FROM(
SELECT R.name as name, COUNT(DISTINCT T.ID_TRACK) AS COUNT_TRACK
FROM RELEASE R, TRACK T, MEDIUM M
WHERE R.ID_RELEASE = M.ID_RELEASE AND M.ID_MEDIUM = T.ID_MEDIUM
GROUP BY R.NAME
ORDER BY COUNT_TRACK DESC
)
WHERE ROWNUM=1;														
--B 2eme esssai
SELECT *
FROM
(SELECT B.name AS NAME,(SELECT COUNT(DISTINCT A.ID_ARTIST)
               FROM ARTIST A
               WHERE A.GENDER='Female' AND B.ID_AREA=A.ID_AREA)
               AS COUNTF, (SELECT COUNT(DISTINCT A.ID_ARTIST)
                           FROM ARTIST A
                           WHERE A.GENDER='Male' AND B.ID_AREA=A.ID_AREA)
                           AS COUNTM, (SELECT COUNT(DISTINCT A.ID_ARTIST)
                                        FROM ARTIST A
                                         WHERE A.TYPE='Group' AND B.ID_AREA=A.ID_AREA)
                                         AS COUNTG
FROM AREA B
ORDER BY COUNTF DESC)
WHERE ROWNUM=1
UNION
SELECT *
FROM
(SELECT B.name AS NAME,(SELECT COUNT(DISTINCT A.ID_ARTIST)
               FROM ARTIST A
               WHERE A.GENDER='Female' AND B.ID_AREA=A.ID_AREA)
               AS COUNTF, (SELECT COUNT(DISTINCT A.ID_ARTIST)
                           FROM ARTIST A
                           WHERE A.GENDER='Male' AND B.ID_AREA=A.ID_AREA)
                           AS COUNTM, (SELECT COUNT(DISTINCT A.ID_ARTIST)
                                        FROM ARTIST A
                                         WHERE A.TYPE='Group' AND B.ID_AREA=A.ID_AREA)
                                         AS COUNTG
FROM AREA B
ORDER BY COUNTM DESC)
WHERE ROWNUM=1
UNION
SELECT *
FROM
(SELECT B.name AS NAME,(SELECT COUNT(DISTINCT A.ID_ARTIST)
               FROM ARTIST A
               WHERE A.GENDER='Female' AND B.ID_AREA=A.ID_AREA)
               AS COUNTF, (SELECT COUNT(DISTINCT A.ID_ARTIST)
                           FROM ARTIST A
                           WHERE A.GENDER='Male' AND B.ID_AREA=A.ID_AREA)
                           AS COUNTM, (SELECT COUNT(DISTINCT A.ID_ARTIST)
                                        FROM ARTIST A
                                         WHERE A.TYPE='Group' AND B.ID_AREA=A.ID_AREA)
                                         AS COUNTG
FROM AREA B
ORDER BY COUNTG DESC)
WHERE ROWNUM=1;
