import React from "react";
import { Github, Bot, FileQuestion, GitCommit, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Hero Section with Animations */}
      <div className="container mx-auto px-4 py-24">
        <div className="flex flex-col items-center space-y-8 text-center">
          <div className="animate-fade-in-up flex items-center space-x-3">
            <Github className="animate-pulse-scale h-12 w-12 text-green-400" />
            <h1 className="text-4xl font-bold text-white transition-transform duration-300 hover:scale-105 md:text-6xl">
              GitHive
            </h1>
          </div>
          <p className="animate-fade-in animate-fill-forwards max-w-2xl text-xl text-gray-300 opacity-0 [animation-delay:400ms] md:text-2xl">
            Unlock the power of AI-driven repository insights. Get detailed
            analysis for every commit and explore your codebase like never
            before.
          </p>
          <div className="flex-col flex items-center gap-1">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-green-500 px-8 text-lg text-white transition-all duration-300 hover:scale-105 hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/20"
              >
                Get Started for Free
              </Button>
            </Link>
            <Link href="/dashboard">
              <p className="animate-fade-in animate-fill-forwards text-sm opacity-0 transition-all duration-300 [animation-delay:800ms] hover:scale-105 text-gray-400">
                Connect GitHub Repository
              </p>
            </Link>
          </div>

          {/* Adding floating animation elements */}
          <div className="animate-float-slow absolute left-1/4 top-1/4 opacity-20">
            <GitCommit className="h-16 w-16 text-green-400" />
          </div>
          <div className="animate-float-delay absolute right-1/4 top-1/3 opacity-20">
            <Bot className="h-16 w-16 text-green-400" />
          </div>
          <div className="animate-float absolute bottom-1/4 left-1/3 opacity-20">
            <FileQuestion className="h-16 w-16 text-green-400" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Card className="border-gray-700 bg-gray-800 transition-transform duration-300 hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <GitCommit className="h-6 w-6 text-green-400" />
                <span>Commit Analysis</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Get AI-powered insights for every commit in your repository
              </CardDescription>
            </CardHeader>
            <CardContent className="text-gray-300">
              Understand code changes, impact analysis, and potential
              improvements with our advanced AI system.
            </CardContent>
          </Card>

          <Card className="border-gray-700 bg-gray-800 transition-transform duration-300 hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <FileQuestion className="h-6 w-6 text-green-400" />
                <span>Code Q&A</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Ask questions about any file in your repository
              </CardDescription>
            </CardHeader>
            <CardContent className="text-gray-300">
              Get instant answers about implementation details, dependencies,
              and code structure.
            </CardContent>
          </Card>

          <Card className="border-gray-700 bg-gray-800 transition-transform duration-300 hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Bot className="h-6 w-6 text-green-400" />
                <span>AI Assistant</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your personal code companion
              </CardDescription>
            </CardHeader>
            <CardContent className="text-gray-300">
              Leverage AI to understand complex codebases, track changes, and
              improve code quality.
            </CardContent>
          </Card>

          <Card className="border-gray-700 bg-gray-800 transition-transform duration-300 hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Users className="h-6 w-6 text-green-400" />
                <span>Team Collaboration</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Work together seamlessly
              </CardDescription>
            </CardHeader>
            <CardContent className="text-gray-300">
              Invite team members, share insights, and collaborate on code
              understanding with controlled access.
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="rounded-lg bg-gray-800 p-8 text-center transition-transform duration-300 hover:scale-105">
          <h2 className="mb-4 text-3xl font-bold text-white">
            Ready to enhance your development workflow?
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-gray-300">
            Join developers who are already using GutHive to streamline their
            code understanding and development process.
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-green-500 px-8 text-white transition-all duration-300 hover:scale-105 hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/20"
            >
              Get Started for Free
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
