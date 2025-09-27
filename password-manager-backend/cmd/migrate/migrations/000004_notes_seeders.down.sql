-- Down: eliminar las notas insertadas en el Up
DELETE FROM notes
WHERE user_id IN (1, 2, 3, 4);
