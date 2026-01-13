import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../auth/AuthContext";
import { useToast } from "../components/ToastProvider";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

const MODELS = [
    { id: "google/gemini-2.0-flash", label: "Gemini 2.0 Flash (صديقك الذكي)" },
    { id: "openai/gpt-4o-mini", label: "GPT-4o mini" },
    { id: "anthropic/claude-3.5-sonnet", label: "Claude 3.5 Sonnet" },
];

const SUGGESTIONS = [
    "ما هو الفرع الأكثر ازدحاماً؟",
    "لخص لي آخر التنبيهات الأمنية",
    "كيف هو أداء فرع العليا؟",
    "هل توجد ملاحظات على فرع النخيل؟",
];

export default function NewChatbot() {
    const { token } = useAuth();
    const toast = useToast();

    const [model, setModel] = useState(MODELS[0].id);
    const [input, setInput] = useState("");
    const [busy, setBusy] = useState(false);
    const [summary, setSummary] = useState("");
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "مرحباً بك في مكمن الذكي 🤖. كيف يمكنني مساعدتك اليوم في تحليل بيانات فروعك؟",
        },
    ]);

    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, busy]);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/analytics/summary`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setSummary(data.summary || "");
                }
            } catch (e) {
                console.error("Summary fetch error:", e);
            }
        };
        if (token) fetchSummary();
    }, [token]);

    const send = async (text) => {
        const q = text || input.trim();
        if (!q || busy) return;

        setInput("");
        setBusy(true);

        const newMessages = [...messages, { role: "user", content: q }];
        setMessages(newMessages);

        try {
            const res = await fetch(`${API_BASE}/api/openrouter/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    model,
                    messages: [
                        {
                            role: "system",
                            content: `أنت مرافق البيانات الذكي لمنصة مكمن. استخدم الملخص التالي للإجابة بدقة: \n\n${summary}\n\nاجعل إجاباتك مهنية، قصيرة، وباللغة العربية.`,
                        },
                        ...newMessages,
                    ],
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "فشل الاتصال");

            setMessages((prev) => [...prev, { role: "assistant", content: data.content || "تم المعالجة بنجاح." }]);
        } catch (e) {
            toast.error("خطأ", e.message);
            setMessages((prev) => [...prev, { role: "assistant", content: "عذراً، حدث خطأ أثناء معالجة طلبك." }]);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="new-chat-container">
            <header className="chat-header">
                <div className="chat-header-info">
                    <h1>مكمن الذكي</h1>
                    <p>تحليل البيانات اللحظي بالذكاء الاصطناعي</p>
                </div>
                <div className="chat-model-selector">
                    <select value={model} onChange={(e) => setModel(e.target.value)}>
                        {MODELS.map((m) => (
                            <option key={m.id} value={m.id}>{m.label}</option>
                        ))}
                    </select>
                </div>
            </header>

            <div className="chat-messages-wrap">
                <div className="chat-messages-list">
                    <AnimatePresence>
                        {messages.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`chat-bubble-row ${m.role === "user" ? "user" : "ai"}`}
                            >
                                <div className="chat-bubble">
                                    {m.content}
                                </div>
                            </motion.div>
                        ))}
                        {busy && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="chat-bubble-row ai">
                                <div className="chat-bubble typing">... جاري التفكير</div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={endRef} />
                </div>
            </div>

            <footer className="chat-footer">
                <div className="chat-suggestions">
                    {SUGGESTIONS.map((s, i) => (
                        <button key={i} onClick={() => send(s)} disabled={busy}>{s}</button>
                    ))}
                </div>
                <div className="chat-input-row">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="اسألني أي شيء عن بياناتك..."
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
                    />
                    <button className="chat-send-btn" onClick={() => send()} disabled={busy || !input.trim()}>
                        ارسل
                    </button>
                </div>
            </footer>

            <style>{`
        .new-chat-container {
          max-width: 900px;
          margin: 20px auto;
          height: calc(100vh - 120px);
          display: flex;
          flex-direction: column;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }

        .chat-header {
          padding: 20px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .chat-header h1 { font-size: 1.4rem; font-weight: 800; margin: 0; }
        .chat-header p { font-size: 0.85rem; opacity: 0.6; margin: 4px 0 0; }

        .chat-model-selector select {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          padding: 8px 12px;
          border-radius: 12px;
          outline: none;
        }

        .chat-messages-wrap {
          flex: 1;
          overflow-y: auto;
          padding: 30px;
        }

        .chat-bubble-row {
          display: flex;
          margin-bottom: 20px;
        }

        .chat-bubble-row.user { justify-content: flex-start; }
        .chat-bubble-row.ai { justify-content: flex-end; }

        .chat-bubble {
          max-width: 80%;
          padding: 14px 20px;
          border-radius: 20px;
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .user .chat-bubble {
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom-left-radius: 4px;
        }

        .ai .chat-bubble {
          background: linear-gradient(135deg, rgba(120, 160, 255, 0.2), rgba(120, 160, 255, 0.05));
          border: 1px solid rgba(120, 160, 255, 0.2);
          border-bottom-right-radius: 4px;
        }

        .chat-footer {
          padding: 20px 30px;
          background: rgba(255, 255, 255, 0.02);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .chat-suggestions {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
          flex-wrap: wrap;
        }

        .chat-suggestions button {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.8);
          padding: 6px 14px;
          border-radius: 12px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: 0.2s;
        }

        .chat-suggestions button:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.2);
        }

        .chat-input-row {
          display: flex;
          gap: 15px;
          align-items: flex-end;
        }

        .chat-input-row textarea {
          flex: 1;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 18px;
          padding: 12px 18px;
          color: white;
          resize: none;
          height: 50px;
          outline: none;
          font-family: inherit;
        }

        .chat-send-btn {
          background: white;
          color: black;
          border: none;
          padding: 0 25px;
          height: 50px;
          border-radius: 18px;
          font-weight: 800;
          cursor: pointer;
          transition: 0.2s;
        }

        .chat-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .chat-send-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(255,255,255,0.2); }

        .typing { opacity: 0.7; font-style: italic; }
      `}</style>
        </div>
    );
}
