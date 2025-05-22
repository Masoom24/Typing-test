"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { passages } from "./Mockdata";
import { MdOutlineTimer } from "react-icons/md";
import Header from "./Header";

export default function StartTypingTest() {
  const searchParams = useSearchParams();
  const [passage, setPassage] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  const passageRef = useRef(null);

  // Calculate results
  const calculateResults = useCallback(() => {
    const totalChars = passage.length;
    const correctChars = typedText
      .split("")
      .filter((c, i) => c === passage[i]).length;
    const wrongChars = typedText.length - correctChars;
    const accuracy = Math.round((correctChars / totalChars) * 100);

    const words = typedText.trim().split(/\s+/).length;
    const timeInMinutes = (searchParams.get("time") - timeLeft) / 60;
    const wpm = Math.round(words / Math.max(timeInMinutes, 0.1));

    const correctWords = typedText.split(" ").filter((word, i) => {
      const passageWord = passage.split(" ")[i];
      return word === passageWord;
    }).length;

    const wrongWords = typedText.split(" ").length - correctWords;

    setResults({
      wpm,
      keystrokes: typedText.length,
      accuracy,
      correctChars,
      wrongChars,
      correctWords,
      wrongWords,
      timeTaken: searchParams.get("time") - timeLeft,
    });
  }, [typedText, passage, timeLeft, searchParams]);

  const handleSubmit = useCallback(() => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    calculateResults();
  }, [isSubmitted, calculateResults]);

  // Initialize test
  useEffect(() => {
    const language = searchParams.get("language");
    const passageId = searchParams.get("passageId");
    const time = parseInt(searchParams.get("time"));

    if (!language || !passageId || isNaN(time)) return;

    const foundPassage = passages[language]?.find(
      (p) => p.id === parseInt(passageId)
    );

    setPassage(foundPassage?.text || "");
    setTimeLeft(time);
  }, [searchParams]);

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0 || isSubmitted) return;

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isSubmitted]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeLeft === 0 && !isSubmitted && passage) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted, handleSubmit, passage]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleTyping = (e) => {
    if (isSubmitted) return;
    const value = e.target.value;
    if (value.length <= passage.length) {
      setTypedText(value);
      setCursorPosition(value.length);
    }
  };

  const handleKeyDown = (e) => {
    if (isSubmitted) return;
    setCursorPosition(e.target.selectionStart);
  };

  const handleClick = (e) => {
    if (isSubmitted) return;
    const textarea = e.target;
    setCursorPosition(textarea.selectionStart);
  };

  return (
    <div className="min-h-screen bg-sky-100 text-black">
      <Header />
      <div className="container mx-auto p-4 md:p-6">
        {!isSubmitted ? (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Side - Passage Typing */}
            <div className="w-full md:w-2/3 flex-col gap-6">
              {/* Editable Passage */}
              <div className="relative">
                <textarea
                  className="w-full border bg-[#ffffff] border-gray-300 p-4 md:p-6 h-[300px] md:h-[450px] rounded text-base md:text-lg outline-none resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono whitespace-pre-wrap leading-relaxed text-transparent caret-black"
                  placeholder="Start typing here..."
                  value={typedText}
                  onChange={handleTyping}
                  onKeyDown={handleKeyDown}
                  onClick={handleClick}
                  spellCheck={false}
                  autoFocus
                />

                {/* Highlighted text overlay */}
                <div
                  ref={passageRef}
                  className="absolute inset-0 p-4 md:p-6 pointer-events-none font-mono text-base md:text-lg whitespace-pre-wrap leading-relaxed overflow-hidden"
                >
                  {passage.split("").map((char, idx) => {
                    let colorClass = "text-gray-400";
                    if (idx < typedText.length) {
                      colorClass =
                        typedText[idx] === char
                          ? "text-green-600"
                          : "text-red-600";
                    }

                    const isCursorPos = idx === cursorPosition;
                    const bgClass = isCursorPos ? "bg-blue-200" : "";

                    return (
                      <span
                        key={idx}
                        className={`${colorClass} ${bgClass} ${
                          char === " " ? "underline" : ""
                        }`}
                      >
                        {char}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Side - Timer + Submit */}
            <div className="w-full md:w-1/3 flex flex-col items-center md:items-start gap-6">
              <div className="w-full md:w-[180px] h-[100px] border border-sky-300 rounded shadow-lg p-4 flex flex-col items-center justify-center">
                <MdOutlineTimer className="h-8 w-8 md:h-10 md:w-10 text-[#172F5F]" />
                <p className="text-lg font-bold text-[#172F5F]">
                  {formatTime(timeLeft)}
                </p>
              </div>

              <button
                className="w-full md:w-auto bg-[#172F5F] text-white py-3 px-6 rounded cursor-pointer hover:bg-blue-700 transition font-medium"
                onClick={handleSubmit}
              >
                Submit Test
              </button>
            </div>
          </div>
        ) : (
          // Results Section
          <div className="p-4 md:p-6 max-w-4xl mx-auto">
            <div className="bg-white w-full md:w-[300px] mx-auto rounded-lg overflow-hidden shadow-md">
              {/* Header */}
              <div className="bg-green-400 text-white text-center py-3">
                <h2 className="text-lg font-semibold">Result</h2>
              </div>
              {/* Main Content */}
              <div className="p-4 md:p-6 space-y-4">
                {/* WPM */}
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-green-600">
                    {results.wpm} WPM
                  </h3>
                  <p className="text-gray-600 text-sm">(words per minute)</p>
                </div>
                {/* Keystrokes */}
                <div className="flex justify-between text-sm">
                  <span>Keystrokes</span>
                  <span className="font-bold">{results.keystrokes}</span>
                </div>

                {/* Accuracy */}
                <div className="flex justify-between text-sm">
                  <span>Accuracy</span>
                  <span className="font-bold">{results.accuracy}%</span>
                </div>

                {/* Correct Words */}
                <div className="flex justify-between text-sm">
                  <span>Correct words</span>
                  <span className="font-bold text-green-600">
                    {results.correctWords}
                  </span>
                </div>

                {/* Wrong Words */}
                <div className="flex justify-between text-sm">
                  <span>Wrong words</span>
                  <span className="font-bold text-red-600">
                    {results.wrongWords}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-6 md:mt-8">
              <h3 className="font-bold text-lg mb-3">Passage Analysis</h3>
              <div className="border border-gray-200 p-3 md:p-4 rounded bg-gray-50 font-mono whitespace-pre-wrap text-sm md:text-base">
                {passage.split("").map((char, idx) => {
                  let colorClass = "text-gray-800";
                  if (idx < typedText.length) {
                    colorClass =
                      typedText[idx] === char
                        ? "text-green-600"
                        : "text-red-600";
                  }
                  return (
                    <span
                      key={idx}
                      className={`${colorClass} ${
                        char === " " ? "underline" : ""
                      }`}
                    >
                      {char}
                    </span>
                  );
                })}
              </div>
            </div>
            <button
              className="mt-6 w-full bg-[#172F5F] text-white py-3 rounded cursor-pointer hover:bg-blue-700 transition font-medium"
              onClick={() => window.location.reload()}
            >
              Restart Test
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
