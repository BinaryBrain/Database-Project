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
FROM(SELECT A.name
	FROM  Artist A, Artist_Track S
	WHERE A.ID_ARTIST=S.ID_ARTIST AND A.gender='group'
	GROUP BY A.ID_ARTIST
	ORDER BY count(S.ID_TRACK) DESC)
WHERE ROWNUM <=10

--D List the name of 10 groups with the most release
SELECT *
FROM(SELECT A.name
	FROM Artist A, Track T, Artist_Track S, Medium M, Release R
	WHERE A.ID_ARTIST =S.ID_ARTIST AND T.ID_TRACK=S.ID_TRACK AND T.ID_MEDIUM=M.ID_MEDIUM AND R.ID_RELEASE = M.ID_RELEASE
	GROUP BY A.ID
	ORDER BY count(R.ID) DESC)
WHERE ROWNUM <=10

--E Print the name of female artist that have the most genres
SELECT A.name
FROM Artist A
WHERE (SELECT Count(*)
	   FROM Artist_Genre G
	   WHERE G.ID_ARTIST = A.ID_ARTIST) >= ALL (SELECT Count(*)
										FROM Artist_Genre G1, Artist A1
										WHERE A1.ID_ARTIST <> A.ID_ARTIST AND G1.ID_ARTIST = A.ID_ARTIST)

--F Print the name of the cities that have more female artist than male artist										
SELECT B.name
FROM Area B
WHERE B.type='city' AND (SELECT Count(*)
						 FROM Artist A
						 WHERE A.gender='female' AND A.ID_AREA= B.ID_AREA) > (SELECT Count(*)
																		FROM Artist A1
																		WHERE A1.gender='male' AND A1.ID_AREA=B.ID_AREA )
--G List the release with the most number of tracks
SELECT R.name
FROM Release R
WHERE  (SELECT Count(T.ID)
		FROM Track T, Medium M
		WHERE R.ID=M.ID_RELEASE AND M.ID=T.ID_MEDIUM) > ALL (SELECT Count(T1.ID)
															FROM Release R1, Medium M1, Track T1
															WHERE R1.ID<> R.ID AND M1.ID= T1.ID_MEDIUM AND R1.ID=M1.ID_RELEASE)
																
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
