"use client";

import { useSession } from "next-auth/react";
import Dashboard from "./components/Dashboard";
import Hero from "@/components/Hero";

export default function Home() {
  const { data: session } = useSession();
  console.log("session", session);

  if (session) {
    return <Dashboard />;
  } else {
    return <Hero />;
  }
}
