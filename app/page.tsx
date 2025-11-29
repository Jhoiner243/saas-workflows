import { Navbar } from '@/components/landing/navbar';
import { PricingCard } from '@/components/landing/pricing-card';
import { Testimonial } from '@/components/landing/testimonial';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, BarChart, Bot, Globe, MessageSquare, Shield, Workflow, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const features = [
    {
      icon: Bot,
      title: 'AI-Powered Chatbots',
      description: 'Create intelligent chatbots that understand and respond to your users naturally with advanced AI.',
    },
    {
      icon: Workflow,
      title: 'n8n Integration',
      description: 'Seamlessly integrate with n8n workflows for powerful automation and custom business logic.',
    },
    {
      icon: Zap,
      title: 'Real-time Chat',
      description: 'WebSocket-powered messaging for instant, bidirectional communication with zero latency.',
    },
    {
      icon: MessageSquare,
      title: 'Conversation Management',
      description: 'Track and manage all conversations with detailed history, analytics, and insights.',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level security with role-based access control and data encryption.',
    },
    {
      icon: BarChart,
      title: 'Advanced Analytics',
      description: 'Gain insights into user behavior, conversation patterns, and chatbot performance.',
    },
    {
      icon: Globe,
      title: 'Multi-language Support',
      description: 'Reach global audiences with support for multiple languages and localization.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance with Redis caching and efficient database queries.',
    },
  ];

  const pricingTiers = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for trying out the platform',
      features: [
        '1 chatbot',
        '100 messages/month',
        'Basic analytics',
        'Community support',
        'n8n integration',
      ],
      cta: 'Get Started',
      ctaLink: '/auth/signup',
    },
    {
      name: 'Pro',
      price: '$29',
      description: 'For growing businesses',
      features: [
        '10 chatbots',
        '10,000 messages/month',
        'Advanced analytics',
        'Priority support',
        'Custom branding',
        'API access',
        'Team collaboration',
      ],
      highlighted: true,
      cta: 'Start Free Trial',
      ctaLink: '/auth/signup',
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations',
      features: [
        'Unlimited chatbots',
        'Unlimited messages',
        'Dedicated support',
        'Custom integrations',
        'SLA guarantee',
        'Advanced security',
        'On-premise deployment',
      ],
      cta: 'Contact Sales',
      ctaLink: '/auth/signup',
    },
  ];

  const testimonials = [
    {
      quote: 'This platform transformed how we handle customer support. Our response time decreased by 70%!',
      author: 'Sarah Johnson',
      role: 'CEO at TechCorp',
    },
    {
      quote: 'The n8n integration is a game-changer. We automated our entire customer onboarding process.',
      author: 'Michael Chen',
      role: 'CTO at StartupXYZ',
    },
    {
      quote: 'Easy to use, powerful features, and excellent support. Highly recommended!',
      author: 'Emily Rodriguez',
      role: 'Product Manager at InnovateCo',
    },
  ];

  const faqs = [
    {
      question: 'How does the n8n integration work?',
      answer: 'When you create a chatbot, we automatically generate an n8n workflow with a webhook trigger. You can customize this workflow to add AI models, database queries, API calls, and any other automation you need.',
    },
    {
      question: 'Can I use my own AI models?',
      answer: 'Yes! Through n8n workflows, you can integrate with any AI provider including OpenAI, Anthropic, Google AI, or even your own custom models.',
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, we offer a free tier that includes 1 chatbot and 100 messages per month. You can upgrade to Pro or Enterprise at any time.',
    },
    {
      question: 'What kind of support do you offer?',
      answer: 'Free tier includes community support, Pro tier gets priority email support, and Enterprise customers receive dedicated support with SLA guarantees.',
    },
    {
      question: 'Can I export my conversation data?',
      answer: 'Yes, all plans include the ability to export conversation history and analytics data in various formats.',
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-20 sm:py-32 pt-32">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm shadow-sm">
              <Zap className="h-4 w-4 text-primary" />
              <span>Powered by n8n Workflows & AI</span>
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Build AI Chatbots
              <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                In Minutes, Not Months
              </span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
              Create, manage, and deploy intelligent chatbots powered by n8n workflows.
              No coding required, just pure automation magic with enterprise-grade security.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="group">
                <Link href="/auth/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/dashboard">
                  View Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to build amazing chatbots
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Powerful features to create, customize, and deploy AI chatbots that delight your users
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="group hover:shadow-lg transition-all hover:scale-105">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Choose the plan that fits your needs. All plans include core features.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {pricingTiers.map((tier) => (
              <PricingCard key={tier.name} tier={tier} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Loved by teams worldwide
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              See what our customers have to say about their experience
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Testimonial key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Have questions? We have answers.
            </p>
          </div>
          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-12 text-center">
              <Bot className="mx-auto mb-6 h-16 w-16 text-primary" />
              <h2 className="mb-4 text-3xl font-bold tracking-tight">
                Ready to transform your customer experience?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Join thousands of businesses using our platform to automate customer interactions
              </p>
              <Button asChild size="lg">
                <Link href="/auth/signup">
                  Start Building Today
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Bot className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">ChatBot SaaS</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Build intelligent chatbots powered by n8n workflows and AI.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
                <li><Link href="/dashboard/chatbots" className="hover:text-foreground transition-colors">Chatbots</Link></li>
                <li><Link href="/#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/#faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
                <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link href="/support" className="hover:text-foreground transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} ChatBot SaaS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

