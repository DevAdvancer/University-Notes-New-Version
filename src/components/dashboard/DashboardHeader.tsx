
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Users, Info } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserProfile from "@/components/profile/UserProfile";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

interface DashboardHeaderProps {
  onManageUsers?: () => void;
  onAboutPage?: () => void;
}

const DashboardHeader = ({ onManageUsers, onAboutPage }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { user, userRole, signOut } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string>('');

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url, full_name')
        .eq('id', user.id)
        .single();

      if (data) {
        setAvatarUrl(data.avatar_url);
        setFullName(data.full_name || '');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const getUserName = () => {
    if (fullName) {
      return fullName.split(' ')[0]; // Get first name only
    }
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0]; // Get first name only
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const getUserInitials = () => {
    if (fullName) {
      return fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user?.email?.slice(0, 2).toUpperCase() || 'U';
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleProfileUpdate = () => {
    fetchUserProfile();  // Refresh profile data
  };

  return (
    <>
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                Welcome back, {getUserName()}! 👋
              </h1>
              <p className="text-sm text-gray-400">
                Ready to continue your learning journey?
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* User Avatar */}
            <Button
              onClick={() => setShowProfile(true)}
              variant="ghost"
              size="sm"
              className="p-1 h-auto hover:bg-gray-800 rounded-full"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatarUrl || undefined} alt="Avatar" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>

            {onAboutPage && (
              <Button
                onClick={onAboutPage}
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <Info className="h-4 w-4 mr-2" />
                About
              </Button>
            )}
            
            {userRole === 'admin' && (
              <Button
                onClick={onManageUsers}
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
            )}
            
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {showProfile && (
        <UserProfile 
          onClose={() => setShowProfile(false)}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
    </>
  );
};

export default DashboardHeader;
