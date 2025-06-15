import { useAuth } from "@/contexts/AuthContext";
import Dashboard from "@/components/dashboard/Dashboard";
import NoteEditor from "@/components/notes/NoteEditor";
import UserManagement from "@/components/admin/UserManagement";
import WelcomePage from "@/components/welcome/WelcomePage";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'welcome' | 'dashboard' | 'note-editor' | 'user-management'>('welcome');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateNote = () => {
    setSelectedNote(null);
    setCurrentView('note-editor');
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setCurrentView('note-editor');
  };

  const handleCloseEditor = () => {
    setCurrentView('dashboard');
    setSelectedNote(null);
  };

  const handleSaveNote = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleManageUsers = () => {
    setCurrentView('user-management');
  };

  const handleCloseUserManagement = () => {
    setCurrentView('dashboard');
  };

  const handleLoginRequired = () => {
    navigate('/auth');
  };

  const handleExploreFeatures = () => {
    navigate('/explore');
  };

  const handleAboutPage = () => {
    navigate('/about');
  };

  // Enhanced loading screen with animated elements
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center mb-6">
            <Loader className="h-12 w-12 text-blue-400 animate-spin" />
          </div>
          <div className="text-white text-2xl font-bold mb-2 animate-fade-in">Loading your study notes...</div>
          <div className="text-gray-400 text-lg animate-fade-in" style={{ animationDelay: '0.5s' }}>
            Please wait while we prepare your workspace
          </div>
          <div className="mt-8 flex justify-center space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Handle different views for non-authenticated users
  if (!user) {
    // Always default to welcome page for non-authenticated users
    return <WelcomePage onLoginRequired={handleLoginRequired} onExploreFeatures={handleExploreFeatures} onAboutPage={handleAboutPage} />;
  }

  // Handle views for authenticated users
  if (currentView === 'note-editor') {
    return (
      <NoteEditor
        note={selectedNote}
        onClose={handleCloseEditor}
        onSave={handleSaveNote}
      />
    );
  }

  if (currentView === 'user-management') {
    return (
      <UserManagement onClose={handleCloseUserManagement} />
    );
  }

  // Default to dashboard for authenticated users
  return (
    <Dashboard
      key={refreshTrigger}
      onCreateNote={handleCreateNote}
      onEditNote={handleEditNote}
      onManageUsers={handleManageUsers}
    />
  );
};

export default Index;
