/*List the release which is associated with the most mediums. If there are more than one such release, list 
all such releases. */

SELECT RID
FROM(
      SELECT R.ID_RELEASE AS RID, COUNT(M.ID_MEDIUM) AS COUNTM
      FROM RELEASE R, MEDIUM M
      WHERE R.ID_RELEASE = M.ID_RELEASE
      GROUP BY R.ID_RELEASE
      ORDER BY COUNT(M.ID_MEDIUM) DESC)
WHERE COUNTM = (SELECT MAX(COUNTM)
                FROM (
                      SELECT COUNT(M.ID_MEDIUM) AS COUNTM
                      FROM RELEASE R, MEDIUM M
                      WHERE R.ID_RELEASE = M.ID_RELEASE
                      GROUP BY R.ID_RELEASE
                      ORDER BY COUNT(M.ID_MEDIUM) DESC
                      )
                );
