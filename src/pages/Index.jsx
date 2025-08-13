import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Upload,
  BookOpen,
  Search,
  Star,
  ArrowRight,
  CheckCircle,
  Zap,
  Users,
  Shield,
  Brain,
  FileText,
  BarChart3,
  Clock,
} from "lucide-react";
import { Marquee } from "../components/ui/TextAnimation";
import ThemeToggle from "../components/ui/ThemeToggle";
import authService from "../services/authService";

const Index = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated()
  );
  const [user, setUser] = useState(authService.getCurrentUser());

  const handleLogout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    navigate("/");
  };

  const features = [
    {
      icon: Upload,
      title: "Smart Upload & OCR",
      description:
        "Upload handwritten notes and get accurate text extraction with our advanced OCR technology",
    },
    {
      icon: BookOpen,
      title: "AI Study Materials",
      description:
        "Automatically generate summaries, MCQs, and practice questions from your notes",
    },
    {
      icon: Search,
      title: "Intelligent Organization",
      description:
        "Smart categorization and searchable content library for all your study materials",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Notes Processed" },
    { number: "95%", label: "OCR Accuracy" },
    { number: "50k+", label: "Questions Generated" },
    { number: "98%", label: "Student Satisfaction" },
  ];

  const studyFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description:
        "Our advanced AI analyzes your handwritten notes and extracts key concepts automatically",
    },
    {
      icon: FileText,
      title: "Smart Summaries",
      description:
        "Generate comprehensive summaries and key point extractions from your study materials",
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description:
        "Monitor your learning progress with detailed analytics and performance insights",
    },
    {
      icon: Clock,
      title: "Study Scheduling",
      description:
        "Optimize your study time with AI-recommended schedules and spaced repetition",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white dark:text-black" />
              </div>
              <span className="text-xl font-bold text-black dark:text-white">
                StudyAI Hub
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/upload"
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm"
                  >
                    Upload Notes
                  </Link>
                  <Link
                    to="/study-tools"
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm"
                  >
                    Study Tools
                  </Link>
                  <Link
                    to="/library"
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm"
                  >
                    Library
                  </Link>
                </>
              ) : (
                <>
                  <a
                    href="#features"
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm"
                  >
                    Features
                  </a>
                  <a
                    href="#how-it-works"
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm"
                  >
                    How it Works
                  </a>
                  <a
                    href="#pricing"
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm"
                  >
                    Pricing
                  </a>
                  <a
                    href="#testimonials"
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm"
                  >
                    Reviews
                  </a>
                </>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Welcome, {user?.firstName}
                  </span>
                  <Button
                    variant="ghost"
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm"
                    onClick={handleLogout}
                  >
                    Sign Out
                  </Button>
                  <Link to="/dashboard">
                    <Button className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black text-sm px-6">
                      Dashboard
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button
                      variant="ghost"
                      className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black text-sm px-6">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-black dark:text-white leading-tight">
              Simplified Study Materials,
              <br />
              Seamless Everywhere
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              Upload, process, and manage your handwritten notes—effortlessly.
              With StudyAI Hub, you transform traditional studying into an
              intelligent, AI-powered learning experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              {isAuthenticated ? (
                <Link to="/upload">
                  <Button
                    size="lg"
                    className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black px-8 py-3 text-base"
                  >
                    Upload Notes
                  </Button>
                </Link>
              ) : (
                <Link to="/register">
                  <Button
                    size="lg"
                    className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black px-8 py-3 text-base"
                  >
                    Get Started Free
                  </Button>
                </Link>
              )}
              <a href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-3 text-base"
                >
                  Learn More
                </Button>
              </a>
            </div>

            {/* Feature Cards */}
            <div id="features" className="grid md:grid-cols-3 gap-8 mb-16">
              <Card className="text-center border border-gray-200 dark:border-gray-700 dark:bg-gray-800 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-black dark:text-white" />
                  </div>
                  <CardTitle className="text-lg text-black dark:text-white">
                    Smart OCR Processing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-400 mb-4">
                    Upload handwritten notes and get 95% accurate text
                    extraction with advanced AI
                  </CardDescription>
                  {isAuthenticated ? (
                    <Link to="/upload">
                      <Button
                        size="sm"
                        className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                      >
                        Upload Notes
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/register">
                      <Button
                        size="sm"
                        className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                      >
                        Try Now
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>

              <Card className="text-center border border-gray-200 dark:border-gray-700 dark:bg-gray-800 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-black dark:text-white" />
                  </div>
                  <CardTitle className="text-lg text-black dark:text-white">
                    AI Study Generation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-400 mb-4">
                    Generate summaries, flashcards, and practice questions
                    automatically from your notes
                  </CardDescription>
                  {isAuthenticated ? (
                    <Link to="/study-tools">
                      <Button
                        size="sm"
                        className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                      >
                        Generate Materials
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/register">
                      <Button
                        size="sm"
                        className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                      >
                        Start Learning
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>

              <Card className="text-center border border-gray-200 dark:border-gray-700 dark:bg-gray-800 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-black dark:text-white" />
                  </div>
                  <CardTitle className="text-lg text-black dark:text-white">
                    Progress Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-400 mb-4">
                    Track your learning progress with detailed insights and
                    performance analytics
                  </CardDescription>
                  {isAuthenticated ? (
                    <Link to="/dashboard">
                      <Button
                        size="sm"
                        className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                      >
                        View Progress
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/register">
                      <Button
                        size="sm"
                        className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                      >
                        Track Progress
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Stats */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 mb-16">
              <div className="text-left mb-6">
                <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                  {isAuthenticated
                    ? `Welcome back, ${user?.firstName}!`
                    : "Welcome to StudyAI Hub"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {isAuthenticated
                    ? `Continue your learning journey with AI-powered study tools`
                    : `Let's grow your LEARNING journey with AI-powered study tools`}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-left">
                    <div className="text-2xl font-bold text-black dark:text-white mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-black dark:text-white">
            How StudyAI Hub Works
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Transform your handwritten notes into powerful study materials with
            our AI-driven platform
          </p>

          <div className="grid md:grid-cols-4 gap-8">
            {studyFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-black dark:text-white">
              Why Choose StudyAI Hub?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Experience the future of studying with our comprehensive
              AI-powered platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <div className="flex items-start space-x-4 mb-8">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-black dark:text-white">
                    Ultra-High Accuracy
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    95% OCR accuracy ensures your handwritten notes are
                    converted to text with minimal errors.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 mb-8">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-black dark:text-white">
                    Instant Processing
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Upload and process your notes in seconds, not minutes. Get
                    immediate results.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-black dark:text-white">
                    Secure & Private
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your notes are encrypted and stored securely. We never share
                    your content.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start space-x-4 mb-8">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-black dark:text-white">
                    Collaborative Learning
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Share study materials with classmates and create study
                    groups effortlessly.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 mb-8">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-black dark:text-white">
                    AI-Powered Insights
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Get personalized study recommendations and insights based on
                    your learning patterns.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-black dark:text-white">
                    Smart Scheduling
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Optimize your study time with AI-recommended schedules and
                    spaced repetition.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-black dark:text-white">
              What Students Say
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Join thousands of students who have transformed their study
              experience with StudyAI Hub
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <Card
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center">
                        <span className="text-white dark:text-black font-semibold text-sm">
                          {`S${index + 1}`}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-black dark:text-white">{`Student ${
                          index + 1
                        }`}</div>
                        <div className="text-gray-500 dark:text-gray-400 text-sm">{`@student_${
                          index + 1
                        }`}</div>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {`"StudyAI Hub has significantly improved my study efficiency. The AI-generated materials are incredibly helpful!"`}
                    </p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black dark:bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Study Experience?
          </h2>
          <p className="text-gray-300 dark:text-gray-400 mb-8 text-lg">
            Join thousands of students who are already studying smarter with
            StudyAI Hub
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link to="/upload">
                <Button
                  size="lg"
                  className="bg-white dark:bg-gray-200 text-black dark:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-300 px-8 py-3 text-base"
                >
                  Upload Your First Notes
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button
                    size="lg"
                    className="bg-white dark:bg-gray-200 text-black dark:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-300 px-8 py-3 text-base"
                  >
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white dark:border-gray-600 text-white dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:text-black dark:hover:text-white px-8 py-3 text-base"
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white dark:text-black" />
                </div>
                <span className="text-xl font-bold text-black dark:text-white">
                  StudyAI Hub
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                Empowering students worldwide with AI-powered study tools that
                transform handwritten notes into comprehensive learning
                materials.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-black dark:text-white">
                Product
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>
                  <a
                    href="#features"
                    className="hover:text-black dark:hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="hover:text-black dark:hover:text-white transition-colors"
                  >
                    How it Works
                  </a>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="hover:text-black dark:hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-black dark:hover:text-white transition-colors"
                  >
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-black dark:text-white">
                Support
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-black dark:hover:text-white transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-black dark:hover:text-white transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-black dark:hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-black dark:hover:text-white transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 mt-8 pt-8 text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2024 StudyAI Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
