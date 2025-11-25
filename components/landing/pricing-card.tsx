import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import Link from 'next/link';

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
  ctaLink: string;
}

interface PricingCardProps {
  tier: PricingTier;
}

export function PricingCard({ tier }: PricingCardProps) {
  return (
    <Card
      className={`relative flex flex-col ${
        tier.highlighted
          ? 'border-primary shadow-lg scale-105'
          : 'border-border'
      }`}
    >
      {tier.highlighted && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
          Most Popular
        </Badge>
      )}
      <CardHeader>
        <CardTitle className="text-2xl">{tier.name}</CardTitle>
        <CardDescription>{tier.description}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">{tier.price}</span>
          {tier.price !== 'Custom' && <span className="text-muted-foreground">/month</span>}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ul className="space-y-3 flex-1">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          asChild
          className="mt-6 w-full"
          variant={tier.highlighted ? 'default' : 'outline'}
        >
          <Link href={tier.ctaLink}>{tier.cta}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
