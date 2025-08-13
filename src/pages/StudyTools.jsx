import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  CheckCircle,
  X,
  RotateCcw,
  Play,
  Pause,
  Clock,
  Target,
  TrendingUp,
  FileText,
  HelpCircle,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Navigation from "@/components/Navigation";

const StudyTools = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [studyTimer, setStudyTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const mcqQuestions = [
    {
      id: 1,
      question: "What is the first law of thermodynamics?",
      options: [
        "Energy cannot be created or destroyed, only converted from one form to another",
        "Heat always flows from hot to cold objects",
        "The entropy of an isolated system always increases",
        "Work is equal to force times distance",
      ],
      correct: 0,
      explanation:
        "The first law of thermodynamics states that energy cannot be created or destroyed, only converted from one form to another. This is also known as the law of conservation of energy.",
      difficulty: "Medium",
      subject: "Physics",
    },
    {
      id: 2,
      question: "Which of the following is NOT a greenhouse gas?",
      options: [
        "Carbon dioxide (CO₂)",
        "Methane (CH₄)",
        "Nitrogen (N₂)",
        "Water vapor (H₂O)",
      ],
      correct: 2,
      explanation:
        "Nitrogen (N₂) is not a greenhouse gas. While it makes up about 78% of Earth's atmosphere, it doesn't absorb infrared radiation effectively.",
      difficulty: "Easy",
      subject: "Chemistry",
    },
    {
      id: 3,
      question: "What is the derivative of x² + 3x + 5?",
      options: ["2x + 3", "x² + 3", "2x + 5", "3x + 5"],
      correct: 0,
      explanation:
        "Using the power rule, the derivative of x² is 2x, the derivative of 3x is 3, and the derivative of a constant (5) is 0. Therefore, the answer is 2x + 3.",
      difficulty: "Easy",
      subject: "Mathematics",
    },
  ];

  const summaryCards = [
    {
      title: "Thermodynamics Basics",
      content:
        "Thermodynamics is the study of heat, work, and energy transfer. Key concepts include the four laws of thermodynamics, heat engines, and entropy.",
      keyPoints: [
        "First Law: Conservation of energy",
        "Second Law: Entropy always increases",
        "Third Law: Absolute zero temperature",
        "Zeroth Law: Thermal equilibrium",
      ],
      difficulty: "Medium",
      readTime: "5 min",
    },
    {
      title: "Chemical Bonding",
      content:
        "Chemical bonds form when atoms share or transfer electrons. The main types are ionic, covalent, and metallic bonds.",
      keyPoints: [
        "Ionic bonds: Transfer of electrons",
        "Covalent bonds: Sharing of electrons",
        "Metallic bonds: Sea of electrons",
        "Intermolecular forces: Van der Waals",
      ],
      difficulty: "Easy",
      readTime: "3 min",
    },
    {
      title: "Calculus Integration",
      content:
        "Integration is the reverse process of differentiation. It's used to find areas under curves and solve differential equations.",
      keyPoints: [
        "Power rule: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C",
        "Integration by parts",
        "Substitution method",
        "Definite vs indefinite integrals",
      ],
      difficulty: "Hard",
      readTime: "8 min",
    },
  ];

  const practiceQuestions = [
    {
      question:
        "Explain the relationship between temperature and kinetic energy in the kinetic theory of gases.",
      type: "Short Answer",
      points: 10,
      hints: [
        "Think about molecular motion",
        "Consider average kinetic energy",
        "Relate to absolute temperature",
      ],
    },
    {
      question:
        "Derive the quadratic formula from the standard form ax² + bx + c = 0.",
      type: "Long Answer",
      points: 15,
      hints: [
        "Use completing the square method",
        "Start with ax² + bx + c = 0",
        "Factor out 'a' from the first two terms",
      ],
    },
    {
      question:
        "Compare and contrast ionic and covalent bonding with examples.",
      type: "Essay",
      points: 20,
      hints: [
        "Discuss electron behavior",
        "Provide specific examples",
        "Mention properties of resulting compounds",
      ],
    },
  ];

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex.toString());
  };

  const handleSubmitAnswer = () => {
    setShowResult(true);
    if (selectedAnswer === mcqQuestions[currentQuestion].correct.toString()) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handlePrevQuestion = () => {
    setCurrentQuestion(currentQuestion - 1);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Study Tools
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Practice with AI-generated questions and review your study materials
          </p>
        </div>

        {/* Study Timer */}
        <Card className="mb-8 border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-lg font-mono font-semibold text-gray-900 dark:text-white">
                    {formatTime(studyTimer)}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {isTimerRunning ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  {isTimerRunning ? "Pause" : "Start"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setStudyTimer(0);
                    setIsTimerRunning(false);
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4" />
                  <span>Goal: 2 hours</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>Streak: 5 days</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="mcq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 dark:bg-gray-800">
            <TabsTrigger
              value="mcq"
              className="flex items-center space-x-2 dark:data-[state=active]:bg-gray-700 dark:text-gray-300 dark:data-[state=active]:text-white"
            >
              <CheckCircle className="w-4 h-4" />
              <span>MCQs</span>
            </TabsTrigger>
            <TabsTrigger
              value="summaries"
              className="flex items-center space-x-2 dark:data-[state=active]:bg-gray-700 dark:text-gray-300 dark:data-[state=active]:text-white"
            >
              <BookOpen className="w-4 h-4" />
              <span>Summaries</span>
            </TabsTrigger>
            <TabsTrigger
              value="practice"
              className="flex items-center space-x-2 dark:data-[state=active]:bg-gray-700 dark:text-gray-300 dark:data-[state=active]:text-white"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Practice Questions</span>
            </TabsTrigger>
          </TabsList>

          {/* MCQ Section */}
          <TabsContent value="mcq">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl text-gray-900 dark:text-white">
                          Question {currentQuestion + 1} of{" "}
                          {mcqQuestions.length}
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                          {mcqQuestions[currentQuestion].subject} •{" "}
                          {mcqQuestions[currentQuestion].difficulty}
                        </CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                      >
                        Score: {score}/{mcqQuestions.length}
                      </Badge>
                    </div>
                    <Progress
                      value={(currentQuestion / mcqQuestions.length) * 100}
                      className="h-2"
                    />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="text-lg font-medium text-gray-900 dark:text-white">
                        {mcqQuestions[currentQuestion].question}
                      </div>

                      <div className="space-y-3">
                        {mcqQuestions[currentQuestion].options.map(
                          (option, index) => (
                            <div
                              key={index}
                              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                selectedAnswer === index.toString()
                                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400"
                                  : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                              } ${
                                showResult &&
                                index === mcqQuestions[currentQuestion].correct
                                  ? "border-green-500 bg-green-50 dark:bg-green-900/30 dark:border-green-400"
                                  : showResult &&
                                    selectedAnswer === index.toString() &&
                                    index !==
                                      mcqQuestions[currentQuestion].correct
                                  ? "border-red-500 bg-red-50 dark:bg-red-900/30 dark:border-red-400"
                                  : ""
                              }`}
                              onClick={() =>
                                !showResult && handleAnswerSelect(index)
                              }
                            >
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                    selectedAnswer === index.toString()
                                      ? "border-blue-500 bg-blue-500 dark:border-blue-400 dark:bg-blue-400"
                                      : "border-gray-300 dark:border-gray-600"
                                  }`}
                                >
                                  {selectedAnswer === index.toString() && (
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                  )}
                                  {showResult &&
                                    index ===
                                      mcqQuestions[currentQuestion].correct && (
                                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    )}
                                  {showResult &&
                                    selectedAnswer === index.toString() &&
                                    index !==
                                      mcqQuestions[currentQuestion].correct && (
                                      <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                                    )}
                                </div>
                                <span className="text-gray-900 dark:text-gray-100">
                                  {option}
                                </span>
                              </div>
                            </div>
                          )
                        )}
                      </div>

                      {showResult && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                          <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                            Explanation:
                          </h4>
                          <p className="text-blue-800 dark:text-blue-300">
                            {mcqQuestions[currentQuestion].explanation}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-6">
                        <Button
                          variant="outline"
                          onClick={handlePrevQuestion}
                          disabled={currentQuestion === 0}
                        >
                          <ChevronLeft className="w-4 h-4 mr-2" />
                          Previous
                        </Button>

                        {!showResult ? (
                          <Button
                            onClick={handleSubmitAnswer}
                            disabled={!selectedAnswer}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            Submit Answer
                          </Button>
                        ) : (
                          <Button
                            onClick={handleNextQuestion}
                            disabled={
                              currentQuestion === mcqQuestions.length - 1
                            }
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            Next Question
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* MCQ Sidebar */}
              <div className="space-y-6">
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg dark:text-white">
                      Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm dark:text-gray-300">
                        <span>Completed</span>
                        <span>
                          {currentQuestion + (showResult ? 1 : 0)}/
                          {mcqQuestions.length}
                        </span>
                      </div>
                      <Progress
                        value={
                          ((currentQuestion + (showResult ? 1 : 0)) /
                            mcqQuestions.length) *
                          100
                        }
                      />

                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {score}
                          </div>
                          <div className="text-xs text-green-600 dark:text-green-400">
                            Correct
                          </div>
                        </div>
                        <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                            {currentQuestion + (showResult ? 1 : 0) - score}
                          </div>
                          <div className="text-xs text-red-600 dark:text-red-400">
                            Incorrect
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg dark:text-white">
                      Study Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Star className="w-4 h-4 text-yellow-500 mt-0.5" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Read each question carefully before answering
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Star className="w-4 h-4 text-yellow-500 mt-0.5" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Eliminate obviously wrong answers first
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Star className="w-4 h-4 text-yellow-500 mt-0.5" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Review explanations for better understanding
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Summaries Section */}
          <TabsContent value="summaries">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {summaryCards.map((card, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg dark:text-white">
                        {card.title}
                      </CardTitle>
                      <Badge
                        variant={
                          card.difficulty === "Easy"
                            ? "secondary"
                            : card.difficulty === "Medium"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {card.difficulty}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center space-x-2 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{card.readTime}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                      {card.content}
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                        Key Points:
                      </h4>
                      <ul className="space-y-1">
                        {card.keyPoints.map((point, pointIndex) => (
                          <li
                            key={pointIndex}
                            className="text-sm text-gray-600 dark:text-gray-300 flex items-start space-x-2"
                          >
                            <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full mt-2"></div>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Full Summary
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Practice Questions Section */}
          <TabsContent value="practice">
            <div className="space-y-6">
              {practiceQuestions.map((question, index) => (
                <Card
                  key={index}
                  className="dark:bg-gray-800 dark:border-gray-700"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg dark:text-white">
                        Question {index + 1}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{question.type}</Badge>
                        <Badge>{question.points} points</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-900 dark:text-white font-medium">
                        {question.question}
                      </p>

                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Hints:
                        </h4>
                        <ul className="space-y-1">
                          {question.hints.map((hint, hintIndex) => (
                            <li
                              key={hintIndex}
                              className="text-sm text-gray-600 dark:text-gray-300 flex items-start space-x-2"
                            >
                              <HelpCircle className="w-3 h-3 mt-1 text-blue-500 dark:text-blue-400" />
                              <span>{hint}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 dark:bg-gray-700">
                        <textarea
                          placeholder="Write your answer here..."
                          className="w-full h-32 resize-none border-0 focus:outline-none text-sm dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          Save Draft
                        </Button>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          Submit Answer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudyTools;
