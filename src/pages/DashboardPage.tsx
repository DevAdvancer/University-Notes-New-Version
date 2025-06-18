import { useNavigate } from "react-router-dom";
import Dashboard from "@/components/dashboard/Dashboard";

interface Note {
  id: string;
  title: string;
  subcode: string;
  status: "pending" | "completed" | "not-started";
  content: string;
  youtube_url?: string;
  author_id: string;
  last_editor_id?: string;
  created_at: string;
  profiles?: {
    full_name: string;
  };
  last_editor_profile?: {
    full_name: string;
  };
}

const DashboardPage = () => {
  const navigate = useNavigate();

  const handleCreateNote = () => {
    navigate('/editor');
  };

  const handleEditNote = (note: Note) => {
    navigate(`/editor/${note.id}`, { state: { note } });
  };

  const handleManageUsers = () => {
    navigate('/admin');
  };

  return (
    <Dashboard
      onCreateNote={handleCreateNote}
      onEditNote={handleEditNote}
      onManageUsers={handleManageUsers}
    />
  );
};

export default DashboardPage;
