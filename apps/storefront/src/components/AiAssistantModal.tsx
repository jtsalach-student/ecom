"use client";

import React, { useState } from "react";
import { Sparkles, X, Send, Bot, User, ArrowRight, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";

export interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: "user" | "bot";
  text: string;
  recommendedProducts?: any[];
}

export function AiAssistantModal({ isOpen, onClose }: AiAssistantModalProps) {
  const { addItem } = useCart();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello! I am The Gadget Master AI Assistant. I can help you compare device specifications, check compatibility, and find the perfect phone or workstation grounded in our verified stock. What are you looking for today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const tenantId = process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID || "the-gadget-master-gh";
      const res = await fetch(`${apiUrl}/ai/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-id": tenantId,
        },
        body: JSON.stringify({ question: userText }),
      });

      if (!res.ok) throw new Error("AI assistant query failed");
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.answer,
          recommendedProducts: data.recommendedProducts,
        },
      ]);
    } catch {
      // Fallback
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I am currently using verified catalogue guidance: For laptops, check out the **Lenovo IdeaPad Slim 5** or **Microsoft Surface Laptop 15**. For flagship phones, the **iPhone 17 Pro Max** and **Xiaomi Redmi Note 13** are verified products available at our East Legon Showroom (Underbridge Mall, Boundary Road) or via WhatsApp order (020 014 7950) with standard store limited warranty.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    "Which laptop is best for coding?",
    "Compare iPhone 16 Pro Max vs Galaxy S25 Ultra",
    "Which charger works for iPhone 16 Pro?",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-xl h-[580px] bg-slate-950 border border-slate-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden text-white animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                GCP Shopping Assistant
              </h3>
              <p className="text-[10px] text-slate-400">
                Grounded in verified catalogue data & live stock
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.sender === "bot" && (
                <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-blue-400" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                  m.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-900 border border-slate-800 text-slate-200"
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>

                {/* Recommended Product Cards */}
                {m.recommendedProducts && m.recommendedProducts.length > 0 && (
                  <div className="mt-3 space-y-2 pt-2 border-t border-slate-800">
                    <span className="text-[10px] uppercase font-mono text-slate-400">
                      Verified Stock In Store
                    </span>
                    {m.recommendedProducts.slice(0, 2).map((p: any) => (
                      <div
                        key={p.id}
                        className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-[11px] text-white truncate">{p.name}</p>
                          <p className="text-[10px] text-blue-400">
                            GHS {p.variants[0]?.retailPrice.toLocaleString()}
                          </p>
                        </div>
                        {p.variants[0] && (
                          <button
                            onClick={() => {
                              addItem(p, p.variants[0], 1);
                              onClose();
                            }}
                            className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-semibold whitespace-nowrap"
                          >
                            Add to Cart
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5 items-center text-xs text-slate-400">
              <Bot className="w-4 h-4 text-blue-400 animate-pulse" />
              <span>Analyzing specifications...</span>
            </div>
          )}
        </div>

        {/* Sample Prompts */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 flex gap-1.5 overflow-x-auto border-t border-slate-900 bg-slate-950/50">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInput(p);
                }}
                className="text-[10px] px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 whitespace-nowrap transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-slate-900/80 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            placeholder="Ask about phones, laptops, compatibility, or prices..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
