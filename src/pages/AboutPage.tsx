import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Github, Linkedin, Mail, Heart, Users, FileText, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Abhirup Kumar",
      role: "Founder & Lead Developer",
      description: "Full-stack developer passionate about education technology and creating tools that help students succeed.",
      email: "theabhirupkumar@gmail.com",
      github: "https://www.github.com/devadvancer",
      linkedin: "https://www.linkedin.com/in/theabhirupkumar",
      avatar: "/abhirupkumar.jpeg", // Image path inside public/
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
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
                About our team
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
          <div className="max-w-6xl mx-auto">
            {/* Mission Section */}
            <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 mb-12">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-white text-center mb-4">
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
                  We believe that every student deserves access to high-quality study materials and collaborative learning tools.
                  Our platform was created to bridge the gap between traditional note-taking and modern digital collaboration,
                  empowering students to learn more effectively and achieve their academic goals.
                </p>
              </CardContent>
            </Card>

            {/* Team Members */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white text-center mb-8">Meet Our Team</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map((member, index) => (
                  <Card
                    key={index}
                    className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105"
                  >
                    <CardHeader className="text-center">
                      <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden shadow-lg border-2 border-white/20">
                        <img
                          src={member.avatar}
                          alt={`${member.name} avatar`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <CardTitle className="text-white text-xl">{member.name}</CardTitle>
                      <p className="text-blue-300 font-medium">{member.role}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                        {member.description}
                      </p>
                      <div className="flex justify-center space-x-3">
                        <a href={`mailto:${member.email}`} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </a>
                        {member.github && (
                          <a href={member.github} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10">
                              <Github className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                        {member.linkedin && (
                          <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10">
                              <Linkedin className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Join Our Team */}
            <Card className="bg-gradient-to-r from-green-600/20 via-blue-600/20 to-purple-600/20 backdrop-blur-lg border border-white/20 mb-12">
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-green-400 mx-auto mb-6" />
                <h3 className="text-3xl font-bold text-white mb-4">Join Our Team</h3>
                <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto mb-6">
                  Are you passionate about education technology and want to help build the future of collaborative learning?
                  We're always looking for talented individuals to join our mission.
                </p>
                <div className="flex items-center justify-center space-x-3 text-blue-300">
                  <Mail className="h-5 w-5" />
                  <a
                    href="mailto:theabhirupkumar@gmail.com"
                    className="text-xl font-medium hover:text-blue-200 transition-colors"
                  >
                    theabhirupkumar@gmail.com
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Thank You */}
            <Card className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-lg border border-white/20">
              <CardContent className="p-12 text-center">
                <Heart className="h-12 w-12 text-red-400 mx-auto mb-6" />
                <h3 className="text-3xl font-bold text-white mb-4">Thank You</h3>
                <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
                  We're grateful for every student who uses our platform and helps us improve.
                  Your feedback and support drive us to create better tools for academic success.
                  Together, we're building the future of collaborative learning.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-8 text-center border-t border-white/10 backdrop-blur-sm bg-white/5">
          <p className="text-gray-400 mb-2">
            © 2025 University Study Notes. Empowering students worldwide.
          </p>
          <p className="text-gray-500 text-sm">
            Built with ❤️ for academic success
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AboutPage;
