Utilisez les outils Oracle pour sortir la version texte, qui est la plus lisible (et qui vous fait maudire les plan d'ex�cutions sur les autres SGBD, mais passons).

Il y a plusieurs m�thodes donc je ne suis pas exhaustif.

Plan d'ex�cution estim� (la requ�te n'est pas ex�cut�e) :
Code :S�lectionner tout - Visualiser dans une fen�tre � part
1
2
3
4
EXPLAIN plan FOR
SELECT ...;
 
SELECT * FROM TABLE(dbms_xplan.display);
Plan d'ex�cution r�el (la requ�te est ex�cut�e) :
Code :S�lectionner tout - Visualiser dans une fen�tre � part
1
2
3
SELECT /*+ gather_plan_statistics */  ...;
 
SELECT * FROM TABLE(dbms_xplan.display_cursor(NULL,NULL,'ALLSTATS LAST'));
Il vous faut par contre quelques privil�ges de lecture sur certaines vues syst�mes.


Copy Paste de http://www.developpez.net/forums/d1244717/bases-donnees/oracle/explain-plan-sous-sql-developer/