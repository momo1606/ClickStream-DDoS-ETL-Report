import React from "react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

type Props = {};

const Hero = (props: Props) => {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white">
      <header className="flex-1 w-full flex justify-center items-center">
        <div className="container px-8 md:px-12 h-full flex flex-col items-center justify-center md:flex-row">
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl drop-shadow-lg">
              Clickstream Brand Analysis Report
            </h1>
            <div className="flex flex-col gap-4 sm:flex-row justify-center md:justify-start">
              <Button
                variant={"link"}
                className="bg-white text-indigo-600 hover:bg-indigo-100"
                onClick={() => signIn("cognito")}
              >
                Get Started
              </Button>
              <Button
                variant={"secondary"}
                className="bg-transparent border border-white text-white hover:bg-white hover:text-indigo-600"
                onClick={() => window.location.href = "#learn-more"}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Hero;
