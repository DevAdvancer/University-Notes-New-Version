
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, BookOpen, Users, Star, Sparkles, ArrowLeft, Zap, Target, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const ExplorePage = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Smart Note Organization",
      description: "Automatically categorize and tag your notes with AI-powered organization system",
      benefits: ["Auto-tagging", "Smart search", "Category suggestions"]
    },
    {
      icon: Users,
      title: "Real-time Collaboration",
      description: "Work together with classmates in real-time with live editing and commenting",
      benefits: ["Live editing", "Comment system", "Share permissions"]
    },
    {
      icon: Zap,
      title: "Quick Capture",
      description: "Instantly capture ideas, lectures, and insights with our lightning-fast editor",
      benefits: ["Voice-to-text", "Image uploads", "Quick templates"]
    },
    {
      icon: Target,
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed analytics and progress insights",
      benefits: ["Study analytics", "Goal setting", "Progress reports"]
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Get insights into your study patterns and optimize your learning efficiency",
      benefits: ["Study insights", "Time tracking", "Performance metrics"]
    },
    {
      icon: Star,
      title: "Smart Recommendations",
      description: "Receive personalized study suggestions based on your learning patterns",
      benefits: ["AI suggestions", "Study reminders", "Content recommendations"]
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

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="p-6 flex justify-between items-center backdrop-blur-sm bg-white/5 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">University Study Notes</h1>
              <p className="text-blue-200 text-sm flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Explore our powerful features
              </p>
            </div>
          </div>
          
          <Link to="/">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full border border-white/20 mb-6">
                <Sparkles className="h-4 w-4 text-blue-300" />
                <span className="text-blue-200 text-sm font-medium">Powerful Features</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6 leading-tight">
                Everything You Need
                <span className="block text-white">To Excel</span>
              </h2>
              <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                Discover the comprehensive suite of tools designed to transform your academic experience and boost your learning potential.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group"
                >
                  <CardHeader className="pb-4">
                    <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl w-fit mb-4 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                      <feature.icon className="h-8 w-8 text-blue-300 group-hover:text-blue-200 transition-colors duration-300" />
                    </div>
                    <CardTitle className="text-white text-xl font-bold mb-2">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 leading-relaxed mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-400">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA Section */}
            <Card className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-lg border border-white/20 shadow-2xl">
              <CardContent className="p-12 text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full border border-yellow-400/30 mb-4">
                    <Star className="h-5 w-5 text-yellow-300" />
                    <span className="text-yellow-200 font-medium">Ready to Get Started?</span>
                  </div>
                </div>
                <h3 className="text-4xl font-bold text-white mb-6">
                  Join the Learning Revolution
                </h3>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                  Experience the future of academic success with our comprehensive note-taking platform. 
                  Start your journey today and see the difference it makes.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link to="/auth">
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-16 py-4 text-xl font-bold shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
                    >
                      Get Started Free
                    </Button>
                  </Link>
                  <Link to="/">
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="border-2 border-white/30 text-white hover:bg-white/10 px-16 py-4 text-xl font-semibold backdrop-blur-sm hover:border-white/50 transition-all duration-200"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Footer */}
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

export default ExplorePage;
