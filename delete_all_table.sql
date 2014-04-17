
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE Artist_Track';
   EXECUTE IMMEDIATE 'DROP TABLE Artist_Genre';
   EXECUTE IMMEDIATE 'DROP TABLE Track';
   EXECUTE IMMEDIATE 'DROP TABLE Medium';
   EXECUTE IMMEDIATE 'DROP TABLE Artist';
   EXECUTE IMMEDIATE 'DROP TABLE Release';
   EXECUTE IMMEDIATE 'DROP TABLE Recording';
   EXECUTE IMMEDIATE 'DROP TABLE Genre';
   EXECUTE IMMEDIATE 'DROP TABLE Area';

EXCEPTION
   WHEN OTHERS THEN
      IF SQLCODE != -942 THEN
         RAISE;
      END IF;
END;