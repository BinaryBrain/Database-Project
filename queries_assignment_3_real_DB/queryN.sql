--List the top 10 releases with the most collaborations, i.e., releases where one artist is performing all 
--songs and the highest number of different guest artists contribute to the album.


SELECT *
FROM(
      SELECT B.RELEASE_ID, C.COUNT_ART
      FROM
      --# OF TRACKS PER ARTIST PER RELEASE
      (SELECT M.ID_RELEASE AS RELEASE_ID, COUNT(DISTINCT T.ID_TRACK) AS COUNT_TRACK
      FROM ARTIST A, TRACK T, MEDIUM M, ARTIST_TRACK AT
      WHERE A.ID_ARTIST=AT.ID_ARTIST AND AT.ID_TRACK=T.ID_TRACK AND T.ID_MEDIUM=M.ID_MEDIUM
      GROUP BY M.ID_RELEASE, A.ID_ARTIST) A,
      --# OF TRACK PER RELEASE
      (SELECT  M.ID_RELEASE AS RELEASE_ID, COUNT(DISTINCT T.ID_TRACK)AS COUNT_TRACK
      FROM MEDIUM M, TRACK T
      WHERE T.ID_MEDIUM=M.ID_MEDIUM
      GROUP BY M.ID_RELEASE) B,
      --# OF DIFFERENT ARTISTS PER RELEASE
      (SELECT M.ID_RELEASE AS RELEASE_ID,COUNT(DISTINCT A.ID_ARTIST)AS COUNT_ART, COUNT(DISTINCT T.ID_TRACK) AS COUNT_TRACK
      FROM ARTIST A, TRACK T, MEDIUM M, ARTIST_TRACK AT
      WHERE A.ID_ARTIST=AT.ID_ARTIST AND AT.ID_TRACK=T.ID_TRACK AND T.ID_MEDIUM=M.ID_MEDIUM
      GROUP BY M.ID_RELEASE) C

WHERE B.RELEASE_ID=A.RELEASE_ID AND A.COUNT_TRACK=B.COUNT_TRACK AND B.RELEASE_ID=C.RELEASE_ID
GROUP BY B.RELEASE_ID, C.COUNT_ART
ORDER BY C.COUNT_ART DESC
)WHERE ROWNUM<=10;
