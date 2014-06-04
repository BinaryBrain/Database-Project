--List the release which is associated with the most mediums. If there are more than one such release, list 
--all such releases.
/*
For each release we count the number of medium they are associated to and we order these releases by this count.
Then we inject this result table in a from of another query. In this outer query we check for all releases if 
the count is equal to the max count of all releases.
*/

SELECT RID, RELEASE_NAME
FROM(
      SELECT R.ID_RELEASE AS RID, R.NAME AS RELEASE_NAME, COUNT(DISTINCT M.ID_MEDIUM) AS COUNTM
      FROM  MEDIUM M, RELEASE R
	  WHERE M.ID_RELEASE=R.ID_RELEASE
      GROUP BY R.ID_RELEASE, R.NAME
      ORDER BY COUNT(DISTINCT M.ID_MEDIUM) DESC)
WHERE COUNTM = (SELECT MAX(COUNTM)
                FROM (
                      SELECT COUNT(DISTINCT M.ID_MEDIUM) AS COUNTM
                      FROM  MEDIUM M
                      GROUP BY M.ID_RELEASE
                      ORDER BY COUNT(DISTINCT M.ID_MEDIUM) DESC
                      )
                );
