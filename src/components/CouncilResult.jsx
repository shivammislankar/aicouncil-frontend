import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function CouncilResult({ data }) {
  return (
    <div className="space-y-8">

      {/* Final Answer */}
      <section className="p-6 rounded-xl border border-border bg-card">
        <h2 className="text-2xl font-bold mb-4">Final Answer</h2>

        <div className="prose prose-neutral max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {data.finalAnswer}
          </ReactMarkdown>
        </div>
      </section>

      {/* Confidence */}
      <div className="text-lg font-semibold">
        Confidence: <span className="text-accent">{data.confidence}%</span>
      </div>

      {/* Reasoning */}
      <details className="p-6 rounded-xl border border-border bg-card">
        <summary className="cursor-pointer text-lg font-semibold">
          How the Council Reasoned
        </summary>

        <div className="space-y-6 mt-4">
          {Object.entries(data.flow).map(([role, content]) => (
            <section key={role}>
              <h3 className="text-xl font-bold mb-2">{role}</h3>

              <div className="prose prose-neutral max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
              </div>
            </section>
          ))}
        </div>
      </details>

    </div>
  );
}
