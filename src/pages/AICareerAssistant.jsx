import { useEffect, useRef, useState } from "react";
import { sendMessage } from "../api/ai";
import DashboardLayout from "./student/DashboardLayout";

const starterMessages = [
  "How do I become a Java Developer?",
  "What skills should I learn for Data Science?",
  "How can I prepare for technical interviews?",
];

const renderInlineText = (text) => text.split(/(\*\*.*?\*\*|`.*?`)/g).map((part, index) => {
  if (part.startsWith("**") && part.endsWith("**")) {
    return <strong key={index}>{part.slice(2, -2)}</strong>;
  }
  if (part.startsWith("`") && part.endsWith("`")) {
    return <code key={index}>{part.slice(1, -1)}</code>;
  }
  return <span key={index}>{part}</span>;
});

const renderAssistantText = (text) => text.split("\n").map((line, index) => {
  const trimmedLine = line.trim();
  if (!trimmedLine) return <div className="ai-response-space" key={index} />;
  if (/^#{1,3}\s/.test(trimmedLine)) {
    return <h4 key={index}>{renderInlineText(trimmedLine.replace(/^#{1,3}\s/, ""))}</h4>;
  }
  if (/^[-*]\s/.test(trimmedLine)) {
    return (
      <div className="ai-response-list-item" key={index}>
        <span>•</span>
        <span className="ai-response-copy">{renderInlineText(trimmedLine.replace(/^[-*]\s/, ""))}</span>
      </div>
    );
  }
  return <p key={index}>{renderInlineText(trimmedLine)}</p>;
});

const AICareerAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hi! I can help with career planning, internships, skill roadmaps, resume tips, and interview prep.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const nextUserMessage = {
      id: Date.now(),
      sender: "user",
      text: trimmed,
    };

    setMessages((current) => [...current, nextUserMessage]);
    setInput("");
    setError("");
    setIsLoading(true);

    try {
      const reply = await sendMessage(trimmed);
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: reply,
        },
      ]);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to reach the AI assistant right now.");
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 2,
          sender: "ai",
          text: "AI service is temporarily unavailable.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <DashboardLayout title="AI Career Assistant" eyebrow="Career guidance">
      <section className="page-intro directory-intro">
        <p className="section-kicker">Assistant</p>
        <h2>Career guidance that fits your goals</h2>
        <p>Ask about skills, career paths, internships, resume strategy, or interview prep.</p>
      </section>

      <div className="ai-chat-shell">
        <div className="ai-chat-heading">
          <div className="ai-assistant-mark" aria-hidden="true">AI</div>
          <div>
            <h3>Ask your career coach</h3>
            <p>Personalized guidance based on your profile and goals.</p>
          </div>
          <span className="ai-status"><span /> Online</span>
        </div>

        <div className="ai-chat-examples">
          <span className="ai-examples-label">Try asking</span>
          {starterMessages.map((message) => (
            <button key={message} type="button" className="ai-example-pill" onClick={() => setInput(message)}>
              {message}
            </button>
          ))}
        </div>

        <div className="ai-chat-window" ref={listRef}>
          {messages.map((message) => (
            <div key={message.id} className={`ai-message ${message.sender === "user" ? "user" : "assistant"}`}>
              <div className="ai-bubble">
                {message.sender === "ai" && <span className="ai-bubble-label">Career coach</span>}
                {message.sender === "ai" ? renderAssistantText(message.text) : message.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="ai-message assistant">
              <div className="ai-bubble loading-bubble">
                <span className="loading-dot" />
                <span className="loading-dot" />
                <span className="loading-dot" />
              </div>
            </div>
          )}

          {error && <div className="ai-error-banner">{error}</div>}
        </div>

        <div className="ai-chat-input-row">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask the AI career coach..."
            aria-label="Career assistant message"
          />
          <button type="button" onClick={handleSend} disabled={isLoading || !input.trim()}>
            {isLoading ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AICareerAssistant;
