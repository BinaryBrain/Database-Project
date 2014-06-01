ALTER TABLE TRACK
ADD CONSTRAINT track_foreign_key
   FOREIGN KEY (ID_Recording)
   REFERENCES Recording (ID_Recording)
   ON DELETE CASCADE;