import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Bot, MessageSquare, Workflow, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const features = [
    {
      icon: Bot,
      title: 'AI-Powered Chatbots',
      description: 'Create intelligent chatbots that understand and respond to your users naturally.',
    },
    {
      icon: Workflow,
      title: 'n8n Integration',
      description: 'Seamlessly integrate with n8n workflows for powerful automation capabilities.',
    },
    {
      icon: Zap,
      title: 'Real-time Chat',
      description: 'WebSocket-powered messaging for instant, bidirectional communication.',
    },
    {
      icon: MessageSquare,
      title: 'Conversation Management',
      description: 'Track and manage all conversations with detailed history and analytics.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20 py-20 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm">
              <Zap className="h-4 w-4 text-primary" />
              <span>Powered by n8n Workflows</span>
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Build AI Chatbots
              <span className="block bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                In Minutes
              </span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
              Create, manage, and deploy intelligent chatbots powered by n8n workflows.
              No coding required, just pure automation magic.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="group">
                <Link href="/dashboard">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/dashboard/chatbots">
                  View Chatbots
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
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
              <Card key={feature.title} className="group hover:shadow-lg transition-shadow">
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

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-12 text-center">
              <Bot className="mx-auto mb-6 h-16 w-16 text-primary" />
              <h2 className="mb-4 text-3xl font-bold tracking-tight">
                Ready to get started?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Create your first chatbot in less than 2 minutes
              </p>
              <Button asChild size="lg">
                <Link href="/dashboard/chatbots">
                  Create Your First Chatbot
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
