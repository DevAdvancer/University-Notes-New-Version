import { useNavigate, useLocation } from "react-router-dom";
import NoteEditor from "@/components/notes/NoteEditor";

interface Note {
  id?: string;
  title: string;
  subcode: string;
  status: "pending" | "completed" | "not-started";
  content: string;
  youtube_url?: string;
  author_id?: string;
  last_editor_id?: string;
}

const NoteEditorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const note = (location.state as { note?: Note })?.note ?? null;

  const handleClose = () => {
    navigate('/dashboard');
  };

  const handleSave = () => {
    navigate('/dashboard');
  };

  return <NoteEditor note={note} onClose={handleClose} onSave={handleSave} />;
};

export default NoteEditorPage;
