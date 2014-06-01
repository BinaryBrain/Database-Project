ALTER TABLE ARTIST_GENRE
ADD CONSTRAINT a_g_foreign_key_artist
   FOREIGN KEY (ID_Artist)
   REFERENCES Artist (ID_Artist)
   ON DELETE CASCADE;
   
/*
Erreur commençant à la ligne: 1 de la commande -
ALTER TABLE ARTIST_GENRE
ADD CONSTRAINT a_g_foreign_key_artist
   FOREIGN KEY (ID_Artist)
   REFERENCES Artist (ID_Artist)
   ON DELETE CASCADE
Rapport d'erreur -
Erreur SQL : ORA-02298: cannot validate (DB2014_G03.A_G_FOREIGN_KEY_ARTIST) - parent keys not found
02298. 00000 - "cannot validate (%s.%s) - parent keys not found"
*Cause:    an alter table validating constraint failed because the table has
           child records.
*Action:   Obvious

*/