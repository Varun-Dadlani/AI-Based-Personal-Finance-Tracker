import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import api from "../api/api";

export default function AIChatWidget({ contextData }) {
  
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  
  if (!contextData) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button className="bg-blue-600 text-white rounded-full p-4 shadow-lg">
        🤖
      </button>
    </div>
  );
}
  const askAI = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const res = await api.post("/ai/chat", {
        question,
        data: contextData
      });
      setAnswer(res.data.answer);
    } catch {
      setAnswer("AI service not available.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FLOATING BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50
                   bg-blue-600 hover:bg-blue-700
                   text-white p-4 rounded-full shadow-lg"
      >
        {open ? <X size={28} /> : <MessageCircle size={45} />}
      </button>

      {/* CHAT PANEL */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50
                     w-[450px] h-[520px]
                     bg-white dark:bg-slate-800
                     rounded-xl shadow-2xl
                     flex flex-col overflow-hidden"
        >
          {/* HEADER */}
          <div className="px-4 py-3 border-b dark:text-white font-semibold mb-4 border-slate-700 font-semibold">
            Finance AI Assistant
          </div>

          {/* BODY */}
          <div className="flex-1 p-4 overflow-y-auto text-sm space-y-3">
            {!answer && (
              <p className="text-gray-500 dark:text-gray-400">
                Ask about your spending, budget, or trends.
              </p>
            )}

            {answer && (
              <div className="text-gray-700 dark:text-gray-300">
                {answer}
              </div>
            )}
          </div>

          {/* INPUT */}
          <div className="p-3 border-t dark:border-slate-700 flex gap-2">
            <input
              className="flex-1 input-dark"
              placeholder="Ask something..."
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === "Enter" && askAI()}
            />
            <button
              className="btn-primary px-3"
              onClick={askAI}
              disabled={loading}
              
            >
              {loading ? "..." : "Ask"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
