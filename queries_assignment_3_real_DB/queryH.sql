--For each area that has more than 30 artists, list the male artist, the female artist and the group with the 
--most tracks recorded.
/*
	First we order the area by the count of their artists and select them if they have more than 30 artists. Then for each area 
	that belongs to this subset we check if it has male, female and group artists in it. If so we order its female artists, male artists
	group artists by counting the number of track they did respectively with an over partition operator and select the first row. 
*/
SELECT AREA_NAME, MALE_NAME, FEMALE_NAME, GROUP_NAME FROM(
SELECT AR.NAME AS AREA_NAME, AM.NAME AS MALE_NAME, AF.NAME AS FEMALE_NAME, AG.NAME AS GROUP_NAME, COUNT(DISTINCT ATM.ID_TRACK), COUNT(DISTINCT ATF.ID_TRACK), COUNT(DISTINCT ATG.ID_TRACK),
ROW_NUMBER()OVER (PARTITION BY AR.NAME ORDER BY COUNT(DISTINCT ATM.ID_TRACK)DESC, COUNT(DISTINCT ATF.ID_TRACK) DESC, COUNT(DISTINCT ATG.ID_TRACK)DESC) AS RN
FROM ARTIST AM, AREA AR, ARTIST_TRACK ATM, ARTIST AF, ARTIST_TRACK ATF, ARTIST AG, ARTIST_TRACK ATG
WHERE AM.ID_AREA=AR.ID_AREA AND AM.GENDER='Male' AND AM.ID_ARTIST=ATM.ID_ARTIST AND AF.ID_AREA=AR.ID_AREA AND AF.GENDER='Female' AND AF.ID_ARTIST=ATF.ID_ARTIST
AND AG.TYPE='Group' AND AG.ID_ARTIST=ATG.ID_ARTIST AND AG.ID_AREA=AR.ID_AREA
AND AR.ID_AREA IN (SELECT AR2.ID_AREA
                   FROM AREA AR2, ARTIST A
                   WHERE A.ID_AREA= AR2.ID_AREA
                   GROUP BY AR2.ID_AREA
                   HAVING COUNT(DISTINCT A.ID_ARTIST)>=30)
GROUP BY AR.ID_AREA,AR.NAME, AM.ID_ARTIST, AM.NAME, AF.ID_ARTIST, AF.NAME, AG.ID_ARTIST, AG.NAME)
WHERE RN=1;
