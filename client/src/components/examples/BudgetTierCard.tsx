import { Heart, Stethoscope, Building2 } from "lucide-react";
import BudgetTierCard from '../BudgetTierCard';

const sampleTiers = [
  {
    id: "basic",
    title: "Basic Care",
    price: "₹10k",
    description: "Essential healthcare for routine needs",
    features: [
      "General physician consultation",
      "Basic diagnostic tests",
      "Generic medication delivery",
      "Health record maintenance",
      "24/7 chat support"
    ],
    icon: <Heart className="h-6 w-6" />
  },
  {
    id: "specialist",
    title: "Specialist Care",
    price: "₹1L",
    description: "Advanced care with specialist doctors",
    features: [
      "Specialist consultations",
      "Advanced diagnostic tests",
      "2 follow-up consultations",
      "Treatment plan creation",
      "Priority booking",
      "Insurance claim support"
    ],
    popular: true,
    icon: <Stethoscope className="h-6 w-6" />
  },
  {
    id: "premium",
    title: "Premium Care",
    price: "₹10L",
    description: "Comprehensive care including surgeries",
    features: [
      "Complete surgical packages",
      "Hospital partner network",
      "EMI assistance available",
      "Post-surgery care",
      "Dedicated care coordinator",
      "Insurance pre-authorization",
      "Second opinion included"
    ],
    icon: <Building2 className="h-6 w-6" />
  }
];

export default function BudgetTierCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {sampleTiers.map((tier) => (
        <BudgetTierCard
          key={tier.id}
          tier={tier}
          onSelect={(selectedTier) => console.log('Selected tier:', selectedTier.title)}
        />
      ))}
    </div>
  );
}