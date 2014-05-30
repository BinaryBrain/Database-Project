/*List the 5 titles that are associated with the most different songs (recordings) along with the number of 
songs that share such title.*/

SELECT *
FROM
(SELECT R.NAME, COUNT(R.ID_RECORDING)
FROM RECORDING R
GROUP BY R.NAME
ORDER BY COUNT(R.ID_RECORDING) DESC)
WHERE ROWNUM <=5