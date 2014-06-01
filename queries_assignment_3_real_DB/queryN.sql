--List the top 10 releases with the most collaborations, i.e., releases where one artist is performing all 
--songs and the highest number of different guest artists contribute to the album.
/* First create the table of releases where one artist perform all the songs. More precisely, we count the number of track 
the artist did on that release and we count the number of track the release has in total and keep this release if the equality holds. 
Then we check if for the medium that contains the matching release there exists a different artist that contribute to 
a same track of this release (we have this information by using the precedent table in the from of this new query)
Finally we order the releases (that match these two conditions) by their number of artists and select the top 10.
*/
/*SELECT *
FROM(
      SELECT ALLR, COUNT(DISTINCT AT2.ID_ARTIST)
      FROM (
                SELECT A.ID_ARTIST AS ALLA, M.ID_RELEASE AS ALLR, M.ID_MEDIUM AS ALLM, COUNT(DISTINCT T.ID_TRACK), COUNT(DISTINCT T2.ID_TRACK)
                FROM ARTIST A, ARTIST_TRACK AT, TRACK T, MEDIUM M, MEDIUM M2, TRACK T2
                WHERE A.ID_ARTIST = AT.ID_ARTIST AND AT.ID_TRACK = T.ID_TRACK AND T.ID_MEDIUM = M.ID_MEDIUM AND M2.ID_MEDIUM = M.ID_MEDIUM AND T2.ID_MEDIUM = M2.ID_MEDIUM
                GROUP BY A.ID_ARTIST,M.ID_RELEASE, M.ID_MEDIUM
                HAVING COUNT(DISTINCT T.ID_TRACK) = COUNT(DISTINCT T2.ID_TRACK)), 
                TRACK T2, ARTIST_TRACK AT2
      WHERE T2.ID_MEDIUM = ALLM AND AT2.ID_ARTIST <> ALLA AND AT2.ID_TRACK = T2.ID_TRACK
      GROUP BY ALLR
      ORDER BY COUNT(DISTINCT AT2.ID_ARTIST) DESC)
WHERE ROWNUM <= 10;*/

SELECT *
FROM(
      SELECT B.RELEASE_ID, C.COUNT_ART
      FROM
      --NBRE DE TRACK PAR ARTIST PAR RELEASE
      (SELECT M.ID_RELEASE AS RELEASE_ID, COUNT(DISTINCT T.ID_TRACK) AS COUNT_TRACK
      FROM ARTIST A, TRACK T, MEDIUM M, ARTIST_TRACK AT
      WHERE A.ID_ARTIST=AT.ID_ARTIST AND AT.ID_TRACK=T.ID_TRACK AND T.ID_MEDIUM=M.ID_MEDIUM
      GROUP BY M.ID_RELEASE, A.ID_ARTIST) A,
      --NBRE DE TRACK PAR RELEASE
      (SELECT  M.ID_RELEASE AS RELEASE_ID, COUNT(DISTINCT T.ID_TRACK)AS COUNT_TRACK
      FROM MEDIUM M, TRACK T
      WHERE T.ID_MEDIUM=M.ID_MEDIUM
      GROUP BY M.ID_RELEASE) B,
      --NBRE D'ARTISTES DIFFERENTS PAR RELEASE
      (SELECT M.ID_RELEASE AS RELEASE_ID,COUNT(DISTINCT A.ID_ARTIST)AS COUNT_ART, COUNT(DISTINCT T.ID_TRACK) AS COUNT_TRACK
      FROM ARTIST A, TRACK T, MEDIUM M, ARTIST_TRACK AT
      WHERE A.ID_ARTIST=AT.ID_ARTIST AND AT.ID_TRACK=T.ID_TRACK AND T.ID_MEDIUM=M.ID_MEDIUM
      GROUP BY M.ID_RELEASE) C

WHERE B.RELEASE_ID=A.RELEASE_ID AND A.COUNT_TRACK=B.COUNT_TRACK AND B.RELEASE_ID=C.RELEASE_ID
GROUP BY B.RELEASE_ID, C.COUNT_ART
ORDER BY C.COUNT_ART DESC
)WHERE ROWNUM<=10;
