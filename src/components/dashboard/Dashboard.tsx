import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Users, Search, Filter, GraduationCap, LogOut, Settings, User, Youtube, BookOpen, Star, TrendingUp, Clock, FileText, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import UserProfile from "@/components/profile/UserProfile";
import { renderMarkdown as parseMarkdown } from "@/lib/markdown";

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

interface DashboardProps {
  onCreateNote: () => void;
  onEditNote: (note: Note) => void;
  onManageUsers?: () => void;
}

const Dashboard = ({ onCreateNote, onEditNote, onManageUsers }: DashboardProps) => {
  const navigate = useNavigate();
  const { user, userRole, signOut } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [userProfile, setUserProfile] = useState<{ full_name: string; can_create_notes: boolean; avatar_url: string | null } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchNotes();
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, can_create_notes, avatar_url')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchNotes = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching notes for user:", user.id);
      
      // Fetch notes first
      const { data: notesData, error: notesError } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (notesError) {
        console.error('Notes fetch error:', notesError);
        throw notesError;
      }

      console.log('Fetched notes:', notesData);

      // Fetch profiles for the notes if we have notes
      if (notesData && notesData.length > 0) {
        // Get all unique user IDs from both author_id and last_editor_id
        const userIds = [...new Set([
          ...notesData.map(note => note.author_id),
          ...notesData.map(note => note.last_editor_id).filter(Boolean)
        ])];
        
        console.log('User IDs to fetch profiles for:', userIds);
        
        // Fetch all profiles for these user IDs in one query
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds);

        if (profilesError) {
          console.error('Profiles fetch error:', profilesError);
          // Don't throw error here, just log it and continue with fallback names
        }

        console.log('Fetched profiles for notes:', profilesData);

        // Create a map for quick profile lookup
        const profilesMap = new Map();
        if (profilesData) {
          profilesData.forEach(profile => {
            profilesMap.set(profile.id, profile);
          });
        }

        // Combine notes with profile data
        const transformedNotes: Note[] = notesData.map(note => {
          // Use last_editor_id if it exists, otherwise fall back to author_id
          const editorId = note.last_editor_id || note.author_id;
          const editorProfile = profilesMap.get(editorId);
          
          console.log(`Note ${note.title}: editorId=${editorId}, editorProfile=`, editorProfile);
          
          return {
            ...note,
            status: note.status as "pending" | "completed" | "not-started",
            last_editor_profile: {
              full_name: editorProfile?.full_name || 'Unknown User'
            }
          };
        });

        console.log('Transformed notes:', transformedNotes);
        setNotes(transformedNotes);
      } else {
        setNotes([]);
      }
    } catch (error: any) {
      console.error('Error fetching notes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch notes: " + (error.message || String(error)),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 border-0";
      case "pending":
        return "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 border-0";
      case "not-started":
        return "bg-gradient-to-r from-slate-500 to-gray-500 text-white shadow-lg shadow-slate-500/25 border-0";
      default:
        return "bg-gradient-to-r from-slate-500 to-gray-500 text-white shadow-lg shadow-slate-500/25 border-0";
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.subcode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || note.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getAvatarText = () => {
    if (userProfile?.full_name) {
      return userProfile.full_name.charAt(0).toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  // Convert markdown to HTML with file previews and hierarchical lists
  const renderMarkdown = (markdown: string) => {
    return parseMarkdown(markdown);
  };

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleNoteClick = (note: Note) => {
    if (userProfile?.can_create_notes || userRole === 'admin') {
      // Users with permissions can edit
      onEditNote(note);
    } else {
      // Users without permissions see read-only preview
      setSelectedNote(note);
    }
  };

  const getUserName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0]; // Get first name only
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const handleAboutPage = () => {
    // Navigate to about page - this would need to be handled by parent component
    console.log('Navigate to about page');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse shadow-2xl">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <div className="text-white text-xl font-semibold">Loading your notes...</div>
        </div>
      </div>
    );
  }

  // Read-only note preview modal for users without permissions
  if (selectedNote && !userProfile?.can_create_notes && userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
        {/* Header */}
        <header className="bg-gradient-to-r from-slate-900/95 to-indigo-900/95 backdrop-blur-xl border-b border-slate-800 px-8 py-6 shadow-2xl">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedNote(null)} 
                className="flex items-center space-x-3 text-slate-300 hover:text-white hover:bg-slate-800 px-6 py-3 rounded-xl"
              >
                <GraduationCap className="h-5 w-5" />
                <span className="font-medium">Back to Notes</span>
              </Button>
              <div className="border-l border-slate-700 pl-6">
                <h1 className="text-2xl font-bold text-white">
                  {selectedNote.title}
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={getStatusColor(selectedNote.status) + " px-4 py-2 rounded-full font-semibold"}>
                {selectedNote.status.replace("-", " ").toUpperCase()}
              </Badge>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-8 py-12">
          <Card className="bg-gradient-to-br from-slate-900/90 to-indigo-900/30 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-3xl">
            <CardHeader className="pb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <label className="text-slate-400 text-sm font-semibold">Subject Code</label>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white">
                    {selectedNote.subcode}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-slate-400 text-sm font-semibold">Status</label>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white">
                    {selectedNote.status.replace("-", " ").toUpperCase()}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-slate-400 text-sm font-semibold">Last Updated By</label>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white">
                    {selectedNote.last_editor_profile?.full_name}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border border-slate-700 rounded-2xl p-8 bg-slate-800/30 backdrop-blur-sm">
                <div 
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: renderMarkdown(selectedNote.content) 
                  }}
                />
                {selectedNote.youtube_url && extractVideoId(selectedNote.youtube_url) && (
                  <div className="mt-8 p-6 bg-slate-800/50 rounded-2xl border border-slate-600/30">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-3">
                      <Youtube className="h-6 w-6 text-red-500" />
                      <span>Video Content</span>
                    </h3>
                    <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${extractVideoId(selectedNote.youtube_url)}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-xl"
                      ></iframe>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-gradient-to-r from-slate-900/95 via-indigo-900/95 to-slate-900/95 backdrop-blur-xl border-b border-slate-800 px-8 py-6 shadow-2xl">
        <div className="max-w-8xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  Welcome back, {getUserName()}! 👋
                </h1>
                <div className="flex items-center space-x-3 text-slate-400 mt-1">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">Collaborative Learning Platform</span>
                  <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                  <span>{notes.length} Notes Available</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <Badge 
              variant="outline" 
              className="border-blue-500/50 text-blue-400 bg-blue-500/10 px-4 py-2 rounded-full font-semibold"
            >
              {userRole === 'admin' ? 'Admin' : 'Student'}
            </Badge>
            <Avatar
              className="bg-gradient-to-br from-blue-500 to-purple-600 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 w-12 h-12"
              onClick={() => setShowProfile(true)}
            >
              <AvatarImage src={userProfile?.avatar_url || undefined} alt="Avatar" />
              <AvatarFallback className="text-white font-bold text-lg bg-transparent">
                {getAvatarText()}
              </AvatarFallback>
            </Avatar>
            {userRole === 'admin' && onManageUsers && (
              <Button 
                variant="outline" 
                onClick={onManageUsers} 
                className="border-slate-600 text-slate-300 hover:bg-slate-800 rounded-xl px-6 py-3"
              >
                <Settings className="h-5 w-5 mr-2" />
                Manage Users
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={handleSignOut} 
              className="border-slate-600 text-slate-300 hover:bg-slate-800 rounded-xl px-6 py-3"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-8xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 backdrop-blur-xl border border-blue-700/30 shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Total Notes</p>
                  <p className="text-3xl font-bold text-white">{notes.length}</p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <FileText className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 backdrop-blur-xl border border-emerald-700/30 shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-200 text-sm font-medium">Completed</p>
                  <p className="text-3xl font-bold text-white">
                    {notes.filter(n => n.status === 'completed').length}
                  </p>
                </div>
                <div className="p-3 bg-emerald-500/20 rounded-xl">
                  <Star className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-900/50 to-amber-800/30 backdrop-blur-xl border border-amber-700/30 shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-200 text-sm font-medium">In Progress</p>
                  <p className="text-3xl font-bold text-white">
                    {notes.filter(n => n.status === 'pending').length}
                  </p>
                </div>
                <div className="p-3 bg-amber-500/20 rounded-xl">
                  <Clock className="h-6 w-6 text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 backdrop-blur-xl border border-purple-700/30 shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm font-medium">With Video</p>
                  <p className="text-3xl font-bold text-white">
                    {notes.filter(n => n.youtube_url).length}
                  </p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Youtube className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-xl rounded-2xl mb-8">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <Input
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 w-96 bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 rounded-xl h-12 text-lg focus:border-blue-400 focus:ring-blue-400/20"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <Filter className="h-5 w-5 text-slate-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
                  >
                    <option value="all">All Status</option>
                    <option value="not-started">Not Started</option>
                    <option value="pending">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              {/* Only show New Note button if user has permission */}
              {(userProfile?.can_create_notes || userRole === 'admin') && (
                <Button 
                  onClick={onCreateNote} 
                  className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
                >
                  <Plus className="h-5 w-5" />
                  <span>New Note</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNotes.map((note) => (
            <Card 
              key={note.id} 
              className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 backdrop-blur-xl border border-slate-700/50 cursor-pointer hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 rounded-2xl group"
              onClick={() => handleNoteClick(note)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                      {note.title}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge variant="outline" className="border-slate-600 text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full text-xs font-mono">
                        {note.subcode}
                      </Badge>
                      {note.youtube_url && (
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-red-400 font-medium">Video</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(note.status)} px-3 py-1 text-xs font-bold rounded-full`}>
                    {note.status.replace("-", " ").toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-700/50">
                    <div className="flex items-center space-x-2">
                      <User className="h-3 w-3" />
                      <span>{note.last_editor_profile?.full_name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(note.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <Card className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-xl rounded-2xl">
            <CardContent className="py-24 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <GraduationCap className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No notes available</h3>
              <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
                {(userProfile?.can_create_notes || userRole === 'admin')
                  ? "Create your first study note to get started on your learning journey" 
                  : "No study notes have been created yet. Check back later for new content."
                }
              </p>
              {(userProfile?.can_create_notes || userRole === 'admin') && (
                <Button 
                  onClick={onCreateNote}
                  className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Note
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <UserProfile 
          onClose={() => setShowProfile(false)} 
          onProfileUpdate={fetchUserProfile}
        />
      )}
    </div>
  );
};

export default Dashboard;
