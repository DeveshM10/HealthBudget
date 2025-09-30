# Design Guidelines for Affordable Healthcare Platform

## Design Approach
**Reference-Based Approach**: Drawing inspiration from healthcare leaders like Practo and telemedicine platforms, combined with fintech transparency patterns from platforms like CRED and Paytm for budget-focused UX.

## Core Design Elements

### Color Palette
**Primary Colors:**
- Medical Teal: 180 65% 45% (trust, healthcare)
- Deep Blue: 210 70% 25% (professionalism, security)

**Light Mode:**
- Background: 0 0% 98%
- Text Primary: 210 15% 15%
- Text Secondary: 210 10% 45%

**Dark Mode:**
- Background: 210 15% 8%
- Text Primary: 0 0% 95%
- Text Secondary: 210 15% 70%

**Accent Colors:**
- Success Green: 120 60% 50% (verified badges, positive actions)
- Warning Orange: 25 85% 55% (alerts, budget notifications)

### Typography
- **Primary**: Inter (Google Fonts) - clean, medical-grade readability
- **Headers**: Inter Semi-Bold (600) for trust and clarity
- **Body**: Inter Regular (400) for accessibility
- **Small Text**: Inter Medium (500) for important details like pricing

### Layout System
**Tailwind Spacing Units**: 2, 4, 6, 8, 12, 16
- Tight spacing (p-2, m-2) for compact info
- Standard spacing (p-4, m-4) for general layout
- Generous spacing (p-8, m-8) for section separation

### Component Library

**Navigation:**
- Clean header with logo, search bar, and user profile
- Budget tier selector prominently displayed
- Mobile-first hamburger menu

**Core UI Elements:**
- Rounded buttons (rounded-lg) with medical-grade feel
- Doctor cards with verification badges
- Budget tier cards with clear pricing
- Trust indicators (verified badges, encryption notices)

**Forms:**
- Large, accessible input fields
- Clear validation states
- Multi-step booking flow with progress indicators

**Data Displays:**
- Doctor profiles with credentials and transparent pricing
- Appointment calendars with availability indicators
- Dashboard cards for patient history

**Overlays:**
- Modal dialogs for booking confirmation
- Toast notifications for appointment updates
- Loading states for video call connections

### Visual Treatment for Marketing Pages

**Color Usage:**
- Hero sections can use vibrant teal gradients
- Budget tier cards with subtle color coding
- Trust elements in calming blues

**Gradients:**
- Hero background: Soft teal to blue gradient (180 65% 45% to 210 70% 35%)
- Budget cards: Subtle gradients per tier
- CTA buttons: Light teal gradient for warmth

**Background Treatments:**
- Clean medical white with subtle grid patterns
- Soft gradient overlays on hero sections
- Minimal geometric patterns for trust sections

### Key Design Principles
1. **Budget Transparency**: Price information always visible and prominent
2. **Medical Trust**: Verification badges, credentials clearly displayed
3. **Accessibility**: Large touch targets, high contrast, simple navigation
4. **Indian Context**: Multilingual support indicators, familiar payment methods
5. **Mobile-First**: Optimized for smartphone usage patterns

### Images
- **Hero Image**: Large banner showing diverse Indian families in healthcare settings, with gradient overlay
- **Doctor Photos**: Professional headshots with verification badges
- **Budget Tier Illustrations**: Simple icons representing different care levels
- **Trust Badges**: Medical certification and security compliance logos
- **Feature Icons**: Healthcare-specific iconography using Heroicons medical set

### Critical Constraints
- Maximum 4 sections on landing page: Hero, Budget Tiers, Trust/Features, CTA
- Single viewport hero design focusing on budget selection
- Minimal animations - only loading states and subtle hover effects
- Strong emphasis on verification and trust indicators throughout