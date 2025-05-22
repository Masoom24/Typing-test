"use client";

import StartTypingTest from "@/Components/Start-test";
import { Suspense } from "react";
// import TypingPage from "@/Components/Typing-test";

function Hello() {
  return (
    <div>
      <Suspense fallback={<p>Loading...</p>}>
        <StartTypingTest />
      </Suspense>
    </div>
  );
}
export default Hello;
