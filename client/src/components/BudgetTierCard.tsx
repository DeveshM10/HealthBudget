import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Check, Star, ArrowRight } from "lucide-react";

interface BudgetTier {
  id: string;
  title: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
}

interface BudgetTierCardProps {
  tier: BudgetTier;
  onSelect?: (tier: BudgetTier) => void;
}

export default function BudgetTierCard({ tier, onSelect }: BudgetTierCardProps) {
  const handleSelect = () => {
    onSelect?.(tier);
    console.log('Budget tier selected:', tier.title);
  };

  return (
    <Card className={`relative hover-elevate transition-all duration-200 ${
      tier.popular ? 'ring-2 ring-primary' : ''
    }`}>
      {tier.popular && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
          <Star className="h-3 w-3 mr-1" />
          Most Popular
        </Badge>
      )}
      
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-3">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            {tier.icon}
          </div>
        </div>
        <h3 className="text-xl font-semibold">{tier.title}</h3>
        <div className="text-3xl font-bold text-primary">{tier.price}</div>
        <p className="text-muted-foreground text-sm">{tier.description}</p>
      </CardHeader>

      <CardContent className="space-y-3">
        {tier.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-2">
            <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </CardContent>

      <CardFooter>
        <Button 
          onClick={handleSelect}
          className="w-full group"
          variant={tier.popular ? "default" : "outline"}
          data-testid={`button-select-${tier.id}`}
        >
          Choose {tier.title}
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
}