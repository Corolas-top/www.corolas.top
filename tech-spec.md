# Corolas — Technical Specification

## Dependencies

### Production Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19 | UI framework |
| react-dom | ^19 | DOM rendering |
| react-router-dom | ^7 | Client-side routing (Home, Terms, Privacy) |
| framer-motion | ^12 | Scroll-triggered animations, page transitions, stagger reveals |

### Dev Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| typescript | ^5 | Type safety |
| vite | ^7 | Build tool |
| tailwindcss | ^3.4 | Utility-first CSS |
| @types/react | ^19 | React type definitions |
| @types/react-dom | ^19 | React DOM type definitions |

### Fonts (via Google Fonts CDN)
- Space Grotesk (weights: 400, 500, 600, 700)
- Inter (weights: 400, 500, 600)
- Noto Serif SC (weight: 600) — for Chinese philosophy text

---

## Component Inventory

### shadcn/ui Components (Built-in)
| Component | Usage |
|-----------|-------|
| Button | Primary/Secondary CTAs, nav links |
| Card | Project cards, team member cards |
| Accordion | Legal page per-project sections |
| Tabs | Legal page project switcher |
| Separator | Section dividers, footer divisions |
| Sheet | Mobile navigation overlay |
| Badge | Project status labels |

### Custom Components

| Component | Props | Description |
|-----------|-------|-------------|
| `ParticleCanvas` | `particleCount?: number` | Canvas-based constellation particle system for hero background |
| `Navbar` | `currentPath: string` | Fixed navigation with blur backdrop, mobile sheet menu |
| `MobileMenu` | `isOpen, onClose` | Fullscreen mobile navigation overlay |
| `HeroSection` | none | Full-height hero with particle bg, philosophy text, CTAs |
| `PhilosophySection` | none | Two-column about section with stats counter |
| `ProjectsSection` | none | 2x2 project cards grid |
| `ProjectCard` | `project: Project` | Individual project card with logo, desc, link |
| `TeamSection` | none | 3-column team member grid |
| `TeamMemberCard` | `member: TeamMember` | Individual team card with avatar, bio |
| `CTASection` | none | Call-to-action banner before footer |
| `Footer` | none | Site footer with links |
| `ScrollReveal` | `children, delay?, direction?` | Wrapper for scroll-triggered fade-in animations |
| `AnimatedCounter` | `value: number, suffix?` | Count-up stat animation |
| `LegalPage` | `title, type: 'terms' \| 'privacy'` | Reusable legal page layout with accordion |
| `ProjectPlaceholder` | `name: string` | Future project logo placeholder |

---

## Animation Implementation Table

| Animation | Library / Approach | Implementation | Complexity |
|-----------|-------------------|----------------|------------|
| Particle constellation canvas | Raw Canvas 2D API | Custom `ParticleCanvas` component with `requestAnimationFrame` loop. Particles drift with Brownian motion, connect within threshold distance. Mouse repulsion via distance calculation. | 🔒 High |
| Page load stagger sequence | Framer Motion | `motion.div` with `initial`, `animate`, `transition.delay` for hero children. Orchestrated via staggerChildren. | Medium |
| Scroll-triggered section reveals | Framer Motion | `useInView` hook + `motion.div` with `whileInView`. Default: `opacity: 0→1`, `y: 40→0`. | Medium |
| Stat count-up | Framer Motion | `useMotionValue` + `useTransform` + `animate` to interpolate from 0 to target over 1500ms. | Medium |
| Nav underline hover | CSS | `::after` pseudo-element with `scaleX(0→1)` transition, `transform-origin: center`. | Low |
| Button hover glow | CSS | `transition: all 0.3s`. Background/border-color/box-shadow changes. Active: `scale(0.97)`. | Low |
| Card hover lift | CSS + Framer | `whileHover={{ y: -4, borderColor }}` with transition. | Low |
| Mobile menu overlay | Framer Motion | `AnimatePresence` + `motion.div` for slide-in. Menu items stagger with `variants`. | Medium |
| Scroll indicator bounce | CSS | `@keyframes bounce` with `translateY(0→8px)`, infinite loop. | Low |
| Legal accordion | shadcn Accordion | Built-in with animated height transition. | Low |
| Avatar ring glow on hover | CSS | `::after` ring with `opacity: 0→1` + `scale` transition. | Low |
| Nav background on scroll | React state | `useScrollPosition` hook toggles class at 100px threshold. | Low |

---

## State & Logic Plan

### Routing Structure
```
/              → Home (all sections)
/terms         → Terms of Service page
/privacy       → Privacy Policy page
```

### Custom Hooks

| Hook | Purpose |
|------|---------|
| `useScrollPosition` | Track scroll Y for nav transparency, trigger animations |
| `useInViewport` | Wrapper around IntersectionObserver for section reveals |

### Data Structures

```typescript
interface Project {
  id: string;
  name: string;
  domain: string;
  logo: string;
  description: string;
  link: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  initials: string; // For avatar placeholder
}
```

### Canvas Particle System Logic

```
Class Particle:
  - position (x, y)
  - velocity (vx, vy) — random + global drift vector
  - radius (1-2.5)
  - alpha (0.3-0.7)
  - pulseState (0-1, for occasional brightening)

  update():
    - position += velocity
    - wrap around screen edges
    - apply global drift vector (slowly rotating over time)
    - occasionally trigger pulse

  draw(ctx):
    - fill circle at position with alpha
    - if pulsing, add glow (larger circle with lower alpha)

Class ParticleSystem:
  - particles: Array<Particle>
  - mousePos: {x, y} | null
  - driftAngle: number (0-2π, slowly increments)

  update():
    - driftAngle += 0.001 per frame
    - for each particle:
      - if mousePos within 200px: apply repulsion force
      - particle.update()

  drawConnections(ctx):
    - for each particle pair within 150px:
      - if both have < 3 connections already:
        - draw line with alpha based on distance

  render():
    - clear canvas
    - drawConnections()
    - for each particle: particle.draw()
```

### Performance Considerations

1. **Canvas pause on out-of-viewport**: Use `IntersectionObserver` on the hero section to pause/resume `requestAnimationFrame` when hero is not visible.
2. **Particle count scaling**: 
   - Desktop (>1024px): 100 particles
   - Tablet (640-1024px): 70 particles  
   - Mobile (<640px): 50 particles
3. **Font loading**: Use `font-display: swap` for Google Fonts to prevent FOIT.
4. **Reduced motion**: Check `prefers-reduced-motion` — disable particle animation, replace scroll reveals with simple opacity fade.

---

## File Structure

```
src/
├── sections/
│   ├── HeroSection.tsx
│   ├── PhilosophySection.tsx
│   ├── ProjectsSection.tsx
│   ├── TeamSection.tsx
│   ├── CTASection.tsx
│   └── Footer.tsx
├── components/
│   ├── Navbar.tsx
│   ├── MobileMenu.tsx
│   ├── ParticleCanvas.tsx
│   ├── ProjectCard.tsx
│   ├── TeamMemberCard.tsx
│   ├── ScrollReveal.tsx
│   ├── AnimatedCounter.tsx
│   ├── LegalPage.tsx
│   └── ProjectPlaceholder.tsx
├── hooks/
│   ├── useScrollPosition.ts
│   └── useInViewport.ts
├── data/
│   └── content.ts          # Projects, team members data
├── pages/
│   ├── HomePage.tsx
│   ├── TermsPage.tsx
│   └── PrivacyPage.tsx
├── types/
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css

public/
├── corolas-logo-white.png
├── platonic-logo.png
├── Yhea-logo.png
├── thea-logo.png
├── edith-logo.png
└── corolas.ico              # Placeholder — user to replace
```

---

## Tailwind Configuration Extensions

```javascript
// tailwind.config.js additions
{
  theme: {
    extend: {
      colors: {
        'corolas-bg': '#050508',
        'corolas-bg-elevated': '#0A0A12',
        'corolas-bg-subtle': '#12121C',
        'corolas-gold': '#D4AF37',
        'corolas-cyan': '#00D4AA',
        'corolas-rose': '#E8508A',
        'corolas-text': '#F0F0F5',
        'corolas-text-secondary': '#8A8A9A',
        'corolas-text-muted': '#5A5A6A',
      },
      fontFamily: {
        'display': ['Space Grotesk', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'chinese': ['Noto Serif SC', 'serif'],
      },
    }
  }
}
```

---

## Notes for Implementation

1. **Favicon**: `public/corolas.ico` is a placeholder. User should replace with actual .ico file.
2. **Project descriptions**: All project description strings in `content.ts` contain `[Your ... here]` markers for user customization.
3. **Team bios**: Same placeholder pattern for team member bios.
4. **Legal text**: Placeholder legal text in `LegalPage` component for Terms and Privacy sections.
5. **Avatar generation**: Team member avatars use abstract CSS-generated placeholders (geometric shapes with initials) rather than requiring image uploads.
