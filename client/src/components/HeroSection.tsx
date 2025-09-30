import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Shield, Clock, Star } from "lucide-react";
import heroImage from "@assets/generated_images/Healthcare_hero_banner_image_26f18d63.png";

interface HeroSectionProps {
  onSearch?: (query: string) => void;
  onGetStarted?: () => void;
}

export default function HeroSection({ onSearch, onGetStarted }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
    console.log('Hero search triggered:', searchQuery);
  };

  const handleGetStarted = () => {
    onGetStarted?.();
    console.log('Get started clicked');
  };

  return (
    <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-chart-1/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container px-4 py-16 text-center text-white">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
              <Shield className="h-3 w-3 mr-1" />
              DPDP Compliant
            </Badge>
            <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
              <Star className="h-3 w-3 mr-1" />
              Verified Doctors
            </Badge>
            <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
              <Clock className="h-3 w-3 mr-1" />
              24/7 Support
            </Badge>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Healthcare that fits
            <br />
            <span className="text-yellow-300">your budget</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-white/90 font-medium">
            Discover quality doctors and treatments within your price range.
            <br />
            <span className="text-lg">Transparent pricing • No hidden costs • Instant booking</span>
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search specialists, conditions, or symptoms..."
                  className="pl-10 h-12 text-foreground bg-white/95 border-white/20"
                  data-testid="input-hero-search"
                />
              </div>
              <Button 
                type="submit" 
                size="lg" 
                className="h-12 px-6 bg-white text-primary hover:bg-white/90"
                data-testid="button-search"
              >
                Search
              </Button>
            </form>
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="h-12 px-8 bg-yellow-400 text-primary hover:bg-yellow-300 font-semibold"
              data-testid="button-get-started"
            >
              Get Started - Choose Your Budget
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm">
            <div>
              <div className="text-2xl font-bold">5000+</div>
              <div className="text-white/80">Verified Doctors</div>
            </div>
            <div>
              <div className="text-2xl font-bold">50k+</div>
              <div className="text-white/80">Happy Patients</div>
            </div>
            <div>
              <div className="text-2xl font-bold">₹500+</div>
              <div className="text-white/80">Starting Consultations</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}