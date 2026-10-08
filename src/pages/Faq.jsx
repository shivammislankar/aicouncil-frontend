import { Link } from "react-router-dom";
import usePageMeta from "../hooks/usePageMeta";
import Footer from "../components/Footer";

const faqs = [
  {
    q: "What is Veritas?",
    a: "Veritas is a reasoning workspace where five specialised AI roles — Analyst, Strategist, Critic, Optimizer and Synthesizer — deliberate on your question in sequence. You get one final answer, but you can also inspect exactly what each role contributed on the way there.",
  },
  {
    q: "How is this different from asking a chatbot once?",
    a: "A single prompt gives you a single pass. Veritas forces four independent perspectives plus a synthesis step, so blind spots, risks and unstated assumptions get raised before you see the conclusion. The reasoning flow is shown to you rather than hidden behind the answer.",
  },
  {
    q: "Which AI models power it?",
    a: "Veritas runs on Google's Gemini models with Groq as a fallback. If a model is rate-limited or unavailable, the request automatically falls back to the next one in the chain, so an answer still comes back instead of failing outright.",
  },
  {
    q: "Do I need an account?",
    a: "Yes. An account is what lets Veritas keep your conversation history separate from everyone else's and let you pick up where you left off.",
  },
  {
    q: "Where are my questions stored?",
    a: "Your questions and Veritas's answers are stored in your account so you can reopen them from the sidebar, and you can delete any of them yourself. The full picture is on the privacy policy page.",
    link: { to: "/privacy", label: "Read the privacy policy" },
  },
  {
    q: "Does my question get sent to anyone else?",
    a: "To generate an answer, the text of your question is sent to Google Gemini and Groq — that is how the response is produced. Don't submit passwords, keys or anything you wouldn't want to share with those providers.",
    link: { to: "/privacy", label: "See the third-party services list" },
  },
  {
    q: "Why does a question sometimes take a while?",
    a: "Several models are called in sequence to build the answer, and the free tiers they run on occasionally hit a short rate limit. When that happens Veritas waits briefly and retries rather than giving up. Simple greetings don't go through the council at all, so they always come back instantly.",
  },
  {
    q: "How many questions can I ask?",
    a: "Veritas runs on free model tiers, which means there is a daily cap rather than an unlimited allowance. Greetings are free and unlimited because they never reach the models.",
    confirm: true,
  },
  {
    q: "How much does Veritas cost?",
    a: "Veritas is free to use today.",
    confirm: true,
  },
  {
    q: "Can I delete a conversation?",
    a: "Yes — every entry in the chat sidebar can be deleted, and once deleted it's gone for good.",
  },
];

export default function Faq() {
  usePageMeta({
    title: "Frequently Asked Questions | Veritas",
    description:
      "How Veritas works, which AI models it uses, where your questions are stored, what it costs, and how to delete your history.",
    path: "/faq",
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Help
        </p>
        <h1 className="text-4xl font-bold tracking-tight mt-2">
          Frequently Asked Questions
        </h1>
        <p className="text-muted-foreground mt-4 leading-relaxed">
          Answers drawn from what Veritas actually does. Anything marked for
          confirmation is a draft waiting on your sign-off.
        </p>

        {faqs.some((f) => f.confirm) && (
          <div className="mt-6 p-4 rounded-xl border border-destructive/40 bg-destructive/10 text-sm">
            <p className="font-semibold text-destructive mb-1">
              Draft — confirm before publishing
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Two answers below ({faqs.filter((f) => f.confirm).length} questions)
              contain claims about pricing and daily limits that only you can
              confirm. Edit them in{" "}
              <code className="font-mono">src/pages/Faq.jsx</code> and delete the{" "}
              <code className="font-mono">confirm: true</code> flag once you&rsquo;re
              happy, then remove this notice.
            </p>
          </div>
        )}

        {/* Plain semantic markup - deliberately NOT using FAQ schema, because Google
            no longer shows FAQ rich results from it. */}
        <dl className="mt-10 space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="p-5 rounded-xl border border-border bg-card/50">
              <dt className="font-semibold text-lg">{f.q}</dt>
              <dd className="mt-2 text-muted-foreground leading-relaxed">
                {f.a}
                {f.confirm && (
                  <span className="ml-2 inline-block align-middle px-2 py-0.5 rounded text-xs font-semibold bg-destructive/15 text-destructive border border-destructive/30">
                    needs your confirmation
                  </span>
                )}
                {f.link && (
                  <>
                    {" "}
                    <Link to={f.link.to} className="text-accent hover:underline">
                      {f.link.label}
                    </Link>
                  </>
                )}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 p-6 rounded-xl border border-border text-center space-y-3">
          <p className="font-semibold">Still stuck?</p>
          <p className="text-sm text-muted-foreground">
            Create an account and put the question straight to the council.
          </p>
          <Link
            to="/signup"
            className="inline-block px-6 py-2.5 rounded-full bg-foreground text-background font-semibold hover:opacity-90 transition"
          >
            Create a free account
          </Link>
        </div>

        <div className="mt-12 pt-6 border-t border-border">
          <Link to="/" className="text-accent hover:underline">
            ← Back to the Veritas homepage
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
