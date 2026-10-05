'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, Shield, TrendingUp, Zap, CheckCircle } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
const HeroSection = () => {
  const navigate = useNavigate();
  return (
    
    <section className="min-h-screen flex flex-col items-center justify-center px-1 py-1 text-center bg-gradient-to-b from-background via-background to-card">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="inline-block px-4 py-2 rounded-full bg-background text-foreground border border-accent/20 text-sm font-medium">
          Multi-Perspective AI Reasoning
        </div>
        

        <div className="absolute top-1 right-6 bg-background text-foreground">
  <ThemeToggle />
</div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-background text-foreground">
          The Veritas Approach to AI
        </h1>

        <p className="text-xl bg-background text-foreground max-w-2xl mx-auto leading-relaxed">
          Five specialized AI roles work together to solve problems better. Reduce hallucinations, force multiple perspectives, and get transparent reasoning.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button onClick={() => navigate('/login')} className="px-8 py-3 rounded-full bg-foreground text-background font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 group">
           Try Veritas <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
          <button onClick={() => navigate('/signup')} className="px-8 py-3 rounded-full bg-foreground text-background font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 group">
            Sign Up <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const roles = [
    {
      title: 'Analyst',
      description: 'Breaks down the problem',
      icon: Brain,
    },
    {
      title: 'Strategist',
      description: 'Builds structured approaches',
      icon: TrendingUp,
    },
    {
      title: 'Critic',
      description: 'Finds flaws and risks',
      icon: Shield,
    },
    {
      title: 'Optimizer',
      description: 'Improves the solution',
      icon: Zap,
    },
    {
      title: 'Synthesizer',
      description: 'Delivers a final answer',
      icon: Brain,
    },
  ];

  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl bg-background text-foreground md:text-5xl font-bold tracking-tight">How It Works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto bg-background text-foreground">
            Five complementary perspectives work in concert to deliver superior decision-making
          </p>
        </div>

        <div className="grid bg-background text-foreground md:grid-cols-5 gap-6">
          {roles.map((role, idx) => {
            const IconComponent = role.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-6 rounded-xl border border-border/50 bg-card/50 hover:bg-card transition group"
              >
                <div className="p-3 rounded-lg bg-accent/10 text-accent mb-4 group-hover:bg-accent/20 transition">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">{role.title}</h3>
                <p className="text-sm text-muted-foreground">{role.description}</p>
                {idx < 4 && (
                  <ArrowRight className="w-4 h-4 text-muted-foreground mt-4 md:hidden" />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 p-8 rounded-xl border border-border/50  backdrop-blur bg-background text-foreground">
          <h3 className="text-xl font-bold mb-6">The Veritas Process</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
              <div>
                <p className="font-semibold">Input Your Challenge</p>
                <p className="text-sm text-muted-foreground">Present the problem to all five agents</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
              <div>
                <p className="font-semibold">Agent Deliberation</p>
                <p className="text-sm text-muted-foreground">Each role analyzes from their unique perspective</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
              <div>
                <p className="font-semibold">Transparent Reasoning</p>
                <p className="text-sm text-muted-foreground">See exactly how each role contributed to the decision</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center flex-shrink-0 font-bold text-sm">4</div>
              <div>
                <p className="font-semibold">Final Synthesis</p>
                <p className="text-sm text-muted-foreground">Receive an integrated, well-reasoned answer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const WhyAICouncilSection = () => {
  const benefits = [
    {
      icon: CheckCircle,
      title: 'Reduces Hallucinations',
      description: 'Multiple perspectives validate each other, catching and eliminating false information',
    },
    {
      icon: Shield,
      title: 'Forces Multiple Perspectives',
      description: 'Each role brings a unique viewpoint, ensuring comprehensive problem analysis',
    },
    {
      icon: TrendingUp,
      title: 'Better Decisions than Single-Prompt AI',
      description: 'Collaborative reasoning beats individual models in accuracy and reliability',
    },
    {
      icon: Brain,
      title: 'Transparent Reasoning Flow',
      description: 'Understand exactly why a decision was made at every step',
    },
  ];

  return (
    <section className="py-24 px-4 bg-background text-foreground">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-background text-foreground">Why Veritas?</h2>
          <p className="text-muted-foreground text-lg">
            Superior AI reasoning through collaboration
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {benefits.map((benefit, idx) => {
            const IconComponent = benefit.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-xl border border-border/50 bg-background/50 hover:bg-background transition space-y-4"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-accent/10 text-accent flex-shrink-0">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="py-20 px-4  border-t border-border/50 bg-background text-foreground">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Ready to Experience Better AI Reasoning?</h2>
          <p className="text-xl text-muted-foreground">
            Join teams using Veritas to make better decisions, faster.
          </p>
        </div>
        <button className="px-8 py-4 rounded-full bg-foreground text-background font-semibold hover:opacity-90 transition inline-flex items-center gap-2">
          Start with Veritas <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <HowItWorksSection />
      <WhyAICouncilSection />
      <CTASection />
    </main>
  );
}
