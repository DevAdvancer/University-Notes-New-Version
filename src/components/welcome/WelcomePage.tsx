
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, BookOpen, Users, Star, Sparkles, Compass, Info } from 'lucide-react';

interface WelcomePageProps {
  onLoginRequired: () => void;
  onExploreFeatures: () => void;
  onAboutPage: () => void;
}

const WelcomePage = ({ onLoginRequired, onExploreFeatures, onAboutPage }: WelcomePageProps) => {
  const features = [
    {
      icon: BookOpen,
      title: "Comprehensive Notes",
      description: "Access detailed study materials and notes for all your courses with rich formatting and multimedia support"
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Share knowledge and collaborate seamlessly with your fellow students in real-time"
    },
    {
      icon: Star,
      title: "Track Progress",
      description: "Monitor your learning journey with intelligent progress tracking and status updates"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M0 0h40v40H0V0zm20 20a20 20 0 1 1 0-40 20 20 0 0 1 0 40z'/%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Enhanced Header */}
        <header className="p-6 flex justify-between items-center backdrop-blur-sm bg-white/5 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">University Study Notes</h1>
              <p className="text-blue-200 text-sm flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Your intelligent academic companion
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              onClick={onAboutPage}
              variant="ghost" 
              className="text-white hover:bg-white/10"
            >
              <Info className="h-4 w-4 mr-2" />
              About
            </Button>
            <Button 
              onClick={onLoginRequired}
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
            >
              Sign In
            </Button>
          </div>
        </header>

        {/* Enhanced Hero Section */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full border border-white/20 mb-6">
                  <Sparkles className="h-4 w-4 text-blue-300" />
                  <span className="text-blue-200 text-sm font-medium">Revolutionize Your Study Experience</span>
                </div>
                <h2 className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6 leading-tight">
                  Study Smarter
                  <span className="block text-white">Learn Faster</span>
                </h2>
              </div>
              <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                Transform your academic journey with our comprehensive note-taking platform. 
                Create, organize, and share knowledge like never before.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  onClick={onLoginRequired}
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 text-lg font-semibold shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-200"
                >
                  Start Your Journey
                </Button>
                <Button 
                  onClick={onExploreFeatures}
                  variant="outline" 
                  size="lg"
                  className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-4 text-lg font-semibold backdrop-blur-sm hover:border-white/50 transition-all duration-200"
                >
                  <Compass className="h-5 w-5 mr-2" />
                  Explore Features
                </Button>
              </div>
            </div>

            {/* Enhanced Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-20">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group"
                >
                  <CardHeader className="pb-4">
                    <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl w-fit mb-6 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                      <feature.icon className="h-8 w-8 text-blue-300 group-hover:text-blue-200 transition-colors duration-300" />
                    </div>
                    <CardTitle className="text-white text-xl font-bold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-lg border border-white/20 shadow-2xl">
              <CardContent className="p-12 text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full border border-yellow-400/30 mb-4">
                    <Star className="h-5 w-5 text-yellow-300" />
                    <span className="text-yellow-200 font-medium">Join 10,000+ Students</span>
                  </div>
                </div>
                <h3 className="text-4xl font-bold text-white mb-6">
                  Ready to Transform Your Studies?
                </h3>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                  Join thousands of successful students who have revolutionized their learning experience. 
                  Start your journey to academic excellence today.
                </p>
                <Button 
                  onClick={onLoginRequired}
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-16 py-4 text-xl font-bold shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
                >
                  Get Started Free
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Enhanced Footer */}
        <footer className="p-8 text-center border-t border-white/10 backdrop-blur-sm bg-white/5">
          <p className="text-gray-400 mb-2">
            © 2024 University Study Notes. Empowering students worldwide.
          </p>
          <p className="text-gray-500 text-sm">
            Built with ❤️ for academic success
          </p>
        </footer>
      </div>
    </div>
  );
};

export default WelcomePage;
