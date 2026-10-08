import { Link } from "react-router-dom";
import usePageMeta from "../hooks/usePageMeta";
import Footer from "../components/Footer";

const collected = [
  {
    item: "Email address",
    where: "Firebase Authentication",
    why: "To create your account, sign you in, and greet you in the sidebar.",
  },
  {
    item: "Password",
    where: "Firebase Authentication",
    why: "Stored hashed and salted by Firebase. Veritas never sees or stores it in plain text.",
  },
  {
    item: "Your questions and Veritas's answers",
    where: "Firebase Firestore, `chatHistory` collection",
    why: "So you can revisit past conversations from the sidebar. You can delete any entry yourself.",
  },
  {
    item: "Your question text, sent onward to AI providers",
    where: "Google Gemini and Groq",
    why: "This is how the answer is generated. Your question is sent to these providers to produce a response.",
  },
  {
    item: "Session token",
    where: "Your browser's local storage",
    why: "Keeps you signed in between visits. It is cleared when you log out.",
  },
  {
    item: "Interface preferences",
    where: "Your browser's local storage",
    why: "Light/dark theme and whether the chat sidebar is open. Not linked to your account.",
  },
  {
    item: "Standard server logs",
    where: "Render (hosting) and Vercel (hosting)",
    why: "IP address, requested URL, and timestamp — the usual operational and security logs any web host keeps.",
  },
];

const thirdParties = [
  {
    name: "Firebase (Google)",
    role: "Accounts and chat history storage",
    link: "https://policies.google.com/privacy",
  },
  {
    name: "Google Gemini",
    role: "Generates answers from your questions",
    link: "https://policies.google.com/privacy",
  },
  {
    name: "Groq",
    role: "Generates answers from your questions",
    link: "https://www.groq.com/privacy-policy/",
  },
  {
    name: "Vercel",
    role: "Hosts the Veritas interface",
    link: "https://vercel.com/legal/privacy-policy",
  },
  {
    name: "Render",
    role: "Hosts the Veritas server",
    link: "https://render.com/privacy",
  },
];

const cookies = [
  ["`token`", "Keeps you signed in", "Until you log out"],
  ["`userEmail`", "Shows your name in the sidebar", "Until you log out"],
  ["`theme`", "Remembers light or dark mode", "Persistent"],
  ["`sidebarOpen`", "Remembers whether the sidebar is open", "Persistent"],
];

export default function Privacy() {
  usePageMeta({
    title: "Privacy Policy | Veritas",
    description:
      "What Veritas collects, which third-party services process it, and how to remove your data. Written from the app's actual data flows.",
    path: "/privacy",
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Legal
        </p>
        <h1 className="text-4xl font-bold tracking-tight mt-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mt-3">
          Last updated 9 October 2026
        </p>

        {/* The checklist explicitly requires this to be flagged for human review. */}
        <div className="mt-8 p-4 rounded-xl border border-destructive/40 bg-destructive/10 text-sm">
          <p className="font-semibold text-destructive mb-1">
            Template — you must review before publishing
          </p>
          <p className="text-muted-foreground leading-relaxed">
            This policy was generated from the app's actual code, so the list of
            collected data below is accurate as built. It is a template, not legal
            advice. Two things still need your input: your contact email in the
            &ldquo;Contact&rdquo; section, and confirmation that you are happy with
            every entry. Delete this notice once reviewed.
          </p>
        </div>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-bold">What Veritas collects</h2>
          <p className="text-muted-foreground leading-relaxed">
            This table is generated from the actual code paths in the app, not a
            guess at what a site like this would normally do.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm text-left">
              <thead className="bg-card text-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">What</th>
                  <th className="px-4 py-3 font-semibold">Where it is stored</th>
                  <th className="px-4 py-3 font-semibold">Why</th>
                </tr>
              </thead>
              <tbody>
                {collected.map((row) => (
                  <tr key={row.item} className="border-t border-border">
                    <td className="px-4 py-3 align-top font-medium">{row.item}</td>
                    <td className="px-4 py-3 align-top text-muted-foreground">
                      {row.where}
                    </td>
                    <td className="px-4 py-3 align-top text-muted-foreground">
                      {row.why}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-bold">Cookies and local storage</h2>
          <p className="text-muted-foreground leading-relaxed">
            Veritas does not set advertising cookies. It uses your browser&rsquo;s
            local storage for the four values below.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm text-left">
              <thead className="bg-card text-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Key</th>
                  <th className="px-4 py-3 font-semibold">Purpose</th>
                  <th className="px-4 py-3 font-semibold">Lifetime</th>
                </tr>
              </thead>
              <tbody>
                {cookies.map(([key, purpose, life]) => (
                  <tr key={key} className="border-t border-border">
                    <td className="px-4 py-3 align-top font-mono">{key}</td>
                    <td className="px-4 py-3 align-top text-muted-foreground">
                      {purpose}
                    </td>
                    <td className="px-4 py-3 align-top text-muted-foreground">
                      {life}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-bold">Third-party services</h2>
          <p className="text-muted-foreground leading-relaxed">
            Veritas is built on other companies&rsquo; infrastructure. Those
            services process your data under their own privacy policies.
          </p>
          <ul className="space-y-3">
            {thirdParties.map((t) => (
              <li key={t.name} className="p-4 rounded-xl border border-border bg-card/50">
                <p className="font-semibold">
                  <a
                    href={t.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {t.name}
                  </a>
                </p>
                <p className="text-sm text-muted-foreground mt-1">{t.role}</p>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Important: when you ask a question, the text of that question is sent to
            Google Gemini and Groq so they can generate an answer. Don&rsquo;t submit
            secrets, credentials or anything you&rsquo;re not willing to share with
            those providers.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-bold">How long we keep it</h2>
          <p className="text-muted-foreground leading-relaxed">
            Your chat history stays in Firestore until you delete it — you can
            remove any conversation yourself from the sidebar, and removing it
            removes it permanently. Account details are kept while your account
            exists. Server logs are retained by Render and Vercel according to
            their own retention schedules.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-bold">Your choices</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
            <li>Delete individual conversations from the chat sidebar.</li>
            <li>Log out to clear your session token from this browser.</li>
            <li>
              Ask us to delete your account and everything associated with it (see
              Contact below).
            </li>
            <li>
              Decline the optional analytics consent banner — the site works
              exactly the same without it.
            </li>
          </ul>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-bold">Children</h2>
          <p className="text-muted-foreground leading-relaxed">
            Veritas is not directed at children under 13, and we do not knowingly
            collect their data. If you believe a child has created an account,
            contact us and we will remove it.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-bold">Changes to this policy</h2>
          <p className="text-muted-foreground leading-relaxed">
            If what Veritas collects changes, this page changes with it. The date
            at the top tells you when it was last updated.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-bold">Contact</h2>
          <p className="text-muted-foreground leading-relaxed">
            Questions about your data, or a request to delete your account, go to:{" "}
            <span className="font-semibold text-destructive">
              [REPLACE — your contact email]
            </span>
          </p>
        </section>

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
