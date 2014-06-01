--List the 5 titles that are associated with the most different songs (recordings) along with the number of 
--songs that share such title.
/*
We select the name of the titles and for each of them we count the number of recording that has this name and we
order them by this count. Finally we select the top 5 of them.
*/
SELECT *
FROM
(SELECT R.NAME, COUNT(R.ID_RECORDING)
FROM RECORDING R
GROUP BY R.NAME
ORDER BY COUNT(R.ID_RECORDING) DESC)
WHERE ROWNUM <=5;