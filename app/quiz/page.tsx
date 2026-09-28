"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/store";

const T = {
  en: {
    questionPrefix: "Question",
    of: "of",
    finishBtn: "Finish Quiz",
    nextBtn: "Next Question",
    completeTitle: "Quiz Complete!",
    scoredText: "You scored",
    outOfText: "out of",
    tryAgain: "Try Again (New Questions)",
    backHome: "Back Home",
    toggleLang: "தமிழில் படிக்க (Read in Tamil)",
    questions: [
      {
        question: "Is it mandatory for pillion riders to wear a helmet in Tamil Nadu?",
        options: ["No, only the driver", "Yes, it is mandatory for both", "Only on highways", "Only in Chennai"],
        answer: 1
      },
      {
        question: "What is the penalty for driving under the influence of alcohol (Drunk Driving) in TN?",
        options: ["₹1000", "₹5000", "₹10,000 + License Suspension", "Warning only"],
        answer: 2
      },
      {
        question: "Heavy commercial vehicles are banned from entering city limits during which hours?",
        options: ["10 AM to 5 PM", "8 AM - 11 AM & 4 PM - 8 PM", "12 PM - 3 PM", "They are never banned"],
        answer: 1
      },
      {
        question: "What should you do if you receive a traffic challan you wish to contest?",
        options: ["Pay it immediately online", "Ignore it", "Wait for Virtual Court SMS to contest", "Argue with the traffic police"],
        answer: 2
      },
      {
        question: "Using a mobile phone while driving a car in Tamil Nadu attracts a fine of up to:",
        options: ["₹500", "₹1000", "₹2000", "₹5000"],
        answer: 3
      },
      {
        question: "What is the penalty for jumping a red light in Chennai limits via ANPR cameras?",
        options: ["₹100", "₹500", "₹1000", "₹2000"],
        answer: 1
      },
      {
        question: "If an auto-rickshaw driver refuses to use the digital fare meter in Chennai, the fine is:",
        options: ["₹100", "₹500", "₹1000", "License Revoked immediately"],
        answer: 1
      },
      {
        question: "Driving without a valid Pollution Under Control (PUC) certificate attracts a fine of:",
        options: ["₹500", "₹2000", "₹5000", "₹10,000"],
        answer: 3
      }
    ]
  },
  ta: {
    questionPrefix: "கேள்வி",
    of: "/",
    finishBtn: "முடிக்க",
    nextBtn: "அடுத்த கேள்வி",
    completeTitle: "வினாடி வினா முடிந்தது!",
    scoredText: "உங்கள் மதிப்பெண்:",
    outOfText: "/",
    tryAgain: "மீண்டும் முயற்சிக்க (புதிய கேள்விகள்)",
    backHome: "முகப்பு செல்க",
    toggleLang: "Read in English",
    questions: [
      {
        question: "தமிழ்நாட்டில் இருசக்கர வாகனத்தில் பின்னால் அமர்ந்திருப்பவரும் ஹெல்மெட் அணிவது கட்டாயமா?",
        options: ["இல்லை, ஓட்டுநருக்கு மட்டுமே", "ஆம், இருவருக்கும் கட்டாயம்", "நெடுஞ்சாலைகளில் மட்டுமே", "சென்னையில் மட்டுமே"],
        answer: 1
      },
      {
        question: "தமிழ்நாட்டில் மது அருந்திவிட்டு வாகனம் ஓட்டினால் (Drunk Driving) அபராதம் என்ன?",
        options: ["₹1000", "₹5000", "₹10,000 + உரிமம் ரத்து", "எச்சரிக்கை மட்டுமே"],
        answer: 2
      },
      {
        question: "கனரக வர்த்தக வாகனங்கள் எந்த நேரங்களில் நகர எல்லைக்குள் நுழைய தடை விதிக்கப்பட்டுள்ளது?",
        options: ["காலை 10 மணி முதல் மாலை 5 மணி வரை", "காலை 8 - 11 மற்றும் மாலை 4 - 8 மணி வரை", "மதியம் 12 - 3 மணி வரை", "ஒருபோதும் தடை இல்லை"],
        answer: 1
      },
      {
        question: "உங்களுக்கு விதிக்கப்பட்ட போக்குவரத்து சலானை நீங்கள் எதிர்க்க (Contest) விரும்பினால் என்ன செய்ய வேண்டும்?",
        options: ["ஆன்லைனில் உடனடியாக செலுத்தவும்", "அதை புறக்கணிக்கவும்", "மெய்நிகர் நீதிமன்ற SMS-க்காக காத்திருக்கவும்", "காவலரிடம் வாக்குவாதம் செய்யவும்"],
        answer: 2
      },
      {
        question: "தமிழ்நாட்டில் கார் ஓட்டும்போது மொபைல் போன் பயன்படுத்தினால் அதிகபட்ச அபராதம் எவ்வளவு?",
        options: ["₹500", "₹1000", "₹2000", "₹5000"],
        answer: 3
      },
      {
        question: "சென்னையில் ANPR கேமராக்கள் மூலம் சிவப்பு விளக்கு சிக்னலை மீறுவதற்கு அபராதம் என்ன?",
        options: ["₹100", "₹500", "₹1000", "₹2000"],
        answer: 1
      },
      {
        question: "சென்னையில் ஆட்டோ ஓட்டுநர் மீட்டரை பயன்படுத்த மறுத்தால் அபராதம் என்ன?",
        options: ["₹100", "₹500", "₹1000", "உடனடியாக உரிமம் ரத்து"],
        answer: 1
      },
      {
        question: "புகை மாசு கட்டுப்பாட்டு (PUC) சான்றிதழ் இல்லாமல் வாகனம் ஓட்டினால் அபராதம் எவ்வளவு?",
        options: ["₹500", "₹2000", "₹5000", "₹10,000"],
        answer: 3
      }
    ]
  }
}

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function QuizPage() {
  const { language, toggleLanguage } = useStore();
  const t = T[language];
  
  const [questions, setQuestions] = useState(t.questions.slice(0, 5)); // Show 5 questions per session
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);

  // Initialize and shuffle questions
  useEffect(() => {
    setQuestions(shuffleArray(t.questions).slice(0, 5));
  }, [t.questions]);

  const handleNext = () => {
    if (selectedOpt === questions[currentQ].answer) {
      setScore(score + 1);
    }
    
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedOpt(null);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setQuestions(shuffleArray(t.questions).slice(0, 5));
    setCurrentQ(0);
    setScore(0);
    setShowResult(false);
    setSelectedOpt(null);
  };

  if (!questions || questions.length === 0) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl flex-1 flex flex-col justify-center">
      <div className="flex justify-end mb-4">
        <button 
          onClick={toggleLanguage}
          className="bg-gray-100 hover:bg-gray-200 text-[var(--color-brand-dark)] font-bold py-2 px-4 rounded-xl text-sm transition-colors border border-gray-200"
        >
          {t.toggleLang}
        </button>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        {!showResult ? (
          <>
            <div className="mb-8">
              <span className="text-sm font-bold text-[var(--color-brand-green)] tracking-wider uppercase mb-2 block">
                {t.questionPrefix} {currentQ + 1} {t.of} {questions.length}
              </span>
              <h2 className="text-2xl font-bold text-gray-900">{questions[currentQ].question}</h2>
            </div>
            
            <div className="space-y-3 mb-8">
              {questions[currentQ].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedOpt(i)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selectedOpt === i 
                    ? 'border-[var(--color-brand-green)] bg-green-50 text-[var(--color-brand-dark)] font-bold' 
                    : 'border-gray-200 hover:border-gray-300 text-gray-900'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={selectedOpt === null}
              className="w-full bg-[var(--color-brand-dark)] text-white font-bold py-4 rounded-xl disabled:opacity-50"
            >
              {currentQ === questions.length - 1 ? t.finishBtn : t.nextBtn}
            </button>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">{t.completeTitle}</h2>
            <p className="text-gray-500 mb-8">{t.scoredText} {score} {t.outOfText} {questions.length}.</p>
            
            <div className="flex gap-4 justify-center">
              <button 
                onClick={handleTryAgain}
                className="bg-gray-100 text-gray-700 font-bold px-6 py-3 rounded-xl hover:bg-gray-200"
              >
                {t.tryAgain}
              </button>
              <Link href="/" className="bg-[var(--color-brand-green)] text-white font-bold px-6 py-3 rounded-xl hover:bg-[var(--color-brand-green-dark)]">
                {t.backHome}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
