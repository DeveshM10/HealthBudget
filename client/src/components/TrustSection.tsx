import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, 
  Star, 
  Clock, 
  Award, 
  Users, 
  Zap,
  CheckCircle,
  Phone
} from "lucide-react";

const trustFeatures = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: "DPDP Compliant",
    description: "Your data is protected with highest security standards"
  },
  {
    icon: <Star className="h-6 w-6" />,
    title: "Verified Doctors",
    description: "All doctors are verified with valid medical licenses"
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "24/7 Support",
    description: "Round-the-clock customer support for your queries"
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: "ISO Certified",
    description: "Healthcare platform certified for quality standards"
  }
];

const statistics = [
  {
    icon: <Users className="h-8 w-8" />,
    number: "50,000+",
    label: "Happy Patients",
    description: "Satisfied with our services"
  },
  {
    icon: <Star className="h-8 w-8" />,
    number: "5,000+",
    label: "Verified Doctors",
    description: "Across all specialties"
  },
  {
    icon: <CheckCircle className="h-8 w-8" />,
    number: "98%",
    label: "Success Rate",
    description: "Successful consultations"
  },
  {
    icon: <Zap className="h-8 w-8" />,
    number: "< 2 min",
    label: "Avg. Booking Time",
    description: "Quick and easy booking"
  }
];

export default function TrustSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4">
        {/* Trust Features */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Trust AffordCare?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We prioritize your health and safety with verified doctors, transparent pricing, and secure platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {trustFeatures.map((feature, index) => (
            <Card key={index} className="text-center hover-elevate">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statistics */}
        <div className="bg-card rounded-lg p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Trusted by Thousands</h3>
            <p className="text-muted-foreground">Join our growing community of satisfied patients</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-primary mb-1">{stat.number}</div>
                <div className="font-medium mb-1">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Support */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-primary/10 to-chart-1/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-4">
                <div className="p-2 rounded-lg bg-primary/20 text-primary">
                  <Phone className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">24/7 Emergency Support</div>
                  <div className="text-sm text-muted-foreground">
                    Call us at <span className="font-medium">1800-AFFORD-CARE</span> for immediate assistance
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}