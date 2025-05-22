"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { languages, passages, timeOptions } from "./Mockdata";
import Header from "./Header";
export default function TypingTestPage() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [selectedPassageId, setSelectedPassageId] = useState(
    passages[languages[0]][0].id
  );
  const [selectedTime, setSelectedTime] = useState(timeOptions[0]);

  const handleStartTest = () => {
    const query = new URLSearchParams({
      language: selectedLanguage,
      passageId: selectedPassageId,
      time: selectedTime,
    }).toString();

    window.open(`/start-typing?${query}`, "_blank");
  };
  return (
    <div>
      <Header />
      <div className="flex justify-center items-center flex-1  h-[525px] bg-sky-100 text-black  ">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mt-2 mb-10">
          <div className="bg-blue-400 text-white text-center py-3 rounded-md mb-6">
            <h2 className="text-lg font-semibold italic">
              Typing Training Test
            </h2>
          </div>
          <div className="space-y-4">
            {/* Select Language */}
            <div className="flex gap">
              <label className="block font-medium text-sm  mb-1">
                Select Language :
              </label>
              <select
                className="w-[250px] p-1 ml-3 border rounded-md shadow-sm"
                value={selectedLanguage}
                onChange={(e) => {
                  setSelectedLanguage(e.target.value);
                  setSelectedPassageId(passages[e.target.value][0].id);
                }}
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
            {/* Select Passage */}
            <div className="flex gap-5">
              <label className="block font-medium text-sm mb-1">
                Select Passage :
              </label>
              <select
                className="w-[250px] p-1 border rounded-md shadow-sm"
                value={selectedPassageId}
                onChange={(e) => setSelectedPassageId(e.target.value)}
              >
                {passages[selectedLanguage].map((passage) => (
                  <option key={passage.id} value={passage.id}>
                    {passage.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Time */}

            <div className="flex gap-10">
              <label className="block font-medium text-sm  mb-1">
                Select Time :
              </label>
              <select
                className="w-[250px] p-1 ml-1 border rounded-md shadow-sm"
                value={selectedTime}
                onChange={(e) => setSelectedTime(parseInt(e.target.value))}
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time / 60} Min
                  </option>
                ))}
              </select>
            </div>

            {/* Start Test Button */}
            <div className="flex justify-center">
              <button
                onClick={handleStartTest}
                className="w-[100px] mt-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
              >
                Start Test
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
