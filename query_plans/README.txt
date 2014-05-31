Utilisez les outils Oracle pour sortir la version texte, qui est la plus lisible (et qui vous fait maudire les plan d'exécutions sur les autres SGBD, mais passons).

Il y a plusieurs méthodes donc je ne suis pas exhaustif.

Plan d'exécution estimé (la requête n'est pas exécutée) :
Code :Sélectionner tout - Visualiser dans une fenêtre à part
1
2
3
4
EXPLAIN plan FOR
SELECT ...;
 
SELECT * FROM TABLE(dbms_xplan.display);
Plan d'exécution réel (la requête est exécutée) :
Code :Sélectionner tout - Visualiser dans une fenêtre à part
1
2
3
SELECT /*+ gather_plan_statistics */  ...;
 
SELECT * FROM TABLE(dbms_xplan.display_cursor(NULL,NULL,'ALLSTATS LAST'));
Il vous faut par contre quelques privilèges de lecture sur certaines vues systèmes.


Copy Paste de http://www.developpez.net/forums/d1244717/bases-donnees/oracle/explain-plan-sous-sql-developer/