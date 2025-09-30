import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import ThemeToggle from "@/components/ThemeToggle";
import { Heart, Stethoscope, Shield, Clock, IndianRupee, Search, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const handleBudgetSelect = (budget: string) => {
    // First login, then redirect to search with the selected budget
    window.location.href = `/api/login?redirect=/doctors?budget=${budget}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">HealthBudget</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button onClick={handleLogin} data-testid="button-login">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
            Quality Healthcare <span className="text-primary">Within Your Budget</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start with what you can afford and discover trusted doctors and treatment options that fit your budget. Transparent pricing, verified doctors, and continuous care.
          </p>
          
          {/* Budget Selection Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
            {/* Basic Budget Tier */}
            <Card className="border-2 hover:border-primary hover:shadow-lg transition-all">
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-2">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <IndianRupee className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Basic Care</CardTitle>
                <CardDescription className="text-xl font-bold text-primary">₹10,000</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="space-y-2 text-left mb-6">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                    <span>General physician consultations</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                    <span>Basic diagnostic tests</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                    <span>Preventive health check-ups</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                    <span>Digital prescriptions</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleBudgetSelect("10k")}
                >
                  Find Doctors <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            
            {/* Standard Budget Tier */}
            <Card className="border-2 border-primary shadow-lg scale-105">
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-2">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <IndianRupee className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Specialist Care</CardTitle>
                <CardDescription className="text-xl font-bold text-primary">₹1,00,000</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="space-y-2 text-left mb-6">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                    <span>Specialist consultations</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                    <span>Advanced diagnostics</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                    <span>Minor procedures</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                    <span>Chronic disease management</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleBudgetSelect("1L")}
                >
                  Find Specialists <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            
            {/* Premium Budget Tier */}
            <Card className="border-2 hover:border-primary hover:shadow-lg transition-all">
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-2">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <IndianRupee className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Surgical Care</CardTitle>
                <CardDescription className="text-xl font-bold text-primary">₹10,00,000</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="space-y-2 text-left mb-6">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                    <span>Surgical procedures</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                    <span>Hospital admissions</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                    <span>Comprehensive care packages</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                    <span>Post-operative follow-ups</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleBudgetSelect("10L")}
                >
                  Find Surgeons <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose HealthBudget?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <IndianRupee className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Budget-First Approach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Start with what you can afford and find quality healthcare options within your budget.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Verified Doctors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  All doctors on our platform are verified for credentials and experience.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Stethoscope className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>End-to-End Care</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  From consultation to recovery, we support your entire healthcare journey.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Trusted by Thousands</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground">Happy Patients</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Verified Doctors</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-primary mb-2">50,000+</div>
              <div className="text-muted-foreground">Consultations Completed</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Join thousands of patients who trust our platform for their healthcare needs.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={handleLogin}
            data-testid="button-join-now"
          >
            Join Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 HealthCare Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}