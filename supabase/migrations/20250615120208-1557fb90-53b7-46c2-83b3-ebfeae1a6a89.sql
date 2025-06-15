
-- Add last_editor_id column to notes table
ALTER TABLE notes ADD COLUMN last_editor_id uuid REFERENCES auth.users(id);

-- Set existing notes' last_editor_id to their author_id as default
UPDATE notes SET last_editor_id = author_id WHERE last_editor_id IS NULL;
