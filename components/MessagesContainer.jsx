"use client";

import React, { useEffect, useRef, useState } from "react";
import MessageCard from "./MessageCard";
import { MessageForm } from "./MessageForm";
import MessageLoading from "./MessageLoading";

export default function MessagesContainer({ projectId, activeFragement, setActiveFragment }) {
  const bottomRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Define fetchMessages outside useEffect
  const fetchMessages = async () => {
    setError(null);
    try {
      const res = await fetch(`/api/messages/get`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to fetch messages");
      }

      const data = await res.json();
      console.log("Fetched messages:", data.messages);

      const msgs = Array.isArray(data.messages)
        ? data.messages
        : data.messages
          ? [data.messages]
          : [];

      setMessages(msgs);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Proper useEffect
  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }
    fetchMessages(); // fetch immediately
    const interval = setInterval(fetchMessages, 10000); // refetch every 10s

    return () => clearInterval(interval); // cleanup
  }, [projectId]);

  // ✅ Update activeFragment when messages change
  useEffect(() => {
    const lastAssistantMessage = messages
      .filter((m) => m.role === "assistant" && m.fragments)
      .slice(-1)[0];

    if (lastAssistantMessage?.fragments) {
      setActiveFragment(lastAssistantMessage.fragments);
    }
  }, [messages, setActiveFragment]);

  // ✅ Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const lastMessage = messages[messages.length - 1];
  const isLastMsgUser = lastMessage?.role === "user";

  // -----------------------------------------------------------------
  // Render states
  // -----------------------------------------------------------------
  if (loading) {
    return <p className="p-4 text-gray-600">Loading messages...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-600">Error: {error}</p>;
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="pt-2 pr-1">
          {messages.length > 0 ? (
            <>
              {messages.map((message) => (
                <MessageCard
                  key={message._id}
                  content={message.content}
                  role={message.role}
                  fragment={message.fragments}
                  createdAt={message.createdAt}
                  activeFragment={activeFragement?.[0]}
                  type={message.type}
                  onFragmentClick={() => setActiveFragment(message.fragments)}
                />
              ))}
              {isLastMsgUser && <MessageLoading />}
              <div ref={bottomRef} />
            </>
          ) : (
            <p className="text-gray-500 p-4">No messages yet.</p>
          )}
        </div>
      </div>

      <div className="relative p-3 pt-1">
        <div className="absolute -top-6 left-0 right-0 h-6 bg-linear-to-b from-transparent to-background/70 pointer-events-none" />
        <MessageForm projectId={projectId}/>
      </div>
    </div>
  );
}
