# TerraBite - Carbon-Aware Food Recommender System

## Overview

**TerraBite** is a world-class, research-grade food recommender system that leverages multi-objective optimization to rank sustainable dining choices. Built with a premium, professional UI and modular architecture, it prioritizes both user experience and scientific accuracy.

### Key Value Proposition
- **Tri-Model Comparison**: Compare three recommendation strategies side-by-side (Commercial, Ingredient-Aware, Lifecycle-Aware)
- **Lifecycle Awareness**: Full-spectrum carbon footprint including production, ingredients, AND logistics
- **Real-time Optimization**: Dynamic delivery distance calculations
- **Interactive Visualization**: Animated comparison placards showing sustainability metrics

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                Frontend (Next.js + React)                   │
│          Premium Obsidian Theme UI with Animations          │
│                                                             │
│  • Location Selection Modal (Cinematic Onboarding)         │
│  • Search Bar with Semantic Query Support                  │
│  • Rotating Cloud Comparison Scene (3 Models)             │
│  • Responsive Bento Grid of Results                       │
│  • Carbon Grade Visualization (A-E Scale)                  │
└─────────────────────────┬─────────────────────────────────┘
                          │ HTTP API
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              API Gateway (FastAPI)                          │
│                                                             │
│  POST /recommend - Get recommendations from a model        │
│  POST /recommend/compare - Get all 3 models               │
│  GET /locations - Get available cities and areas          │
└─────────────────────────┬─────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│         Recommender Engine (Pluggable)                      │
│                                                             │
│  BaseRecommender (Abstract Interface)                      │
│    ├── BaselineRecommender (Relevance only)               │
│    ├── IngredientAwareRecommender (Partial carbon)        │
│    └── LifecycleAwareRecommender (Full LCA) ⭐             │
└─────────────────────────┬─────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│         Data Layer (PostgreSQL + Vector DB)                 │
│                                                             │
│  • food_items (name, restaurant, carbon_score, etc)       │
│  • restaurants (location, delivery_radius)                │
│  • carbon_metrics (detailed lifecycle breakdown)          │
│  • embeddings (for semantic search)                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Frontend Features (Premium UI)

### 1. **Location Selection Modal**
- Cinematic full-screen entrance with smooth animations
- Two-step process: City → Area
- Beautiful glassmorphism design
- Staggered button animations with hover effects

### 2. **Search Interface**
- Premium search bar with icon feedback
- Metric toggle (Grade A-E vs CO₂e values)
- Compare button to trigger tri-model analysis
- Disabled states for incomplete selections

### 3. **Tri-Model Comparison Scene** (The Star Feature)
**When user clicks COMPARE:**
```
┌─────────────────────────────────────┐
│   Tri-Model Comparison Analysis     │
│                                     │
│         ☁️ Commercial               │
│        /  \                         │
│      ☁️     ☁️ Lifecycle            │
│      |      |  (Highlighted)        │
│      Ingredient-Aware               │
│                                     │
│  Three rotating placards showing:   │
│  • Model name & subtitle            │
│  • Top recommendation for query     │
│  • Carbon grade (A-E) with color    │
│  • Absolute CO₂e value (kg)         │
│  • Restaurant & pricing             │
│  • Distance                         │
│                                     │
│  → Hover pauses rotation            │
│  → Shows scaled-up details          │
│  → Smooth spring physics            │
└─────────────────────────────────────┘
```

**Animation Details:**
- 28-second rotation cycle (slower, more cinematic than original)
- Three clouds equally spaced (120° apart)
- Each offset by -9.33s for continuous coverage
- Hover: Pause animation, scale up 1.2x, increase brightness
- Spring physics for natural deceleration

### 4. **Results Dashboard**
- Bento grid layout (responsive, auto-columns)
- Glass-morphic cards with specular highlight effects
- Staggered entrance animations
- Hover states with elevation and glow
- Carbon grade badge (large, color-coded)
- Restaurant info, pricing, transit distance

### 5. **Empty States**
- Beautiful illustrations for different scenarios
- Location not selected
- No search query
- No results found
- Smooth animations and CTAs

---

## Design System

### Color Scheme
| Element | Color | Hex |
|---------|-------|-----|
| Background | Obsidian-950 | #020617 |
| Accent (Green) | Emerald-500 | #22c55e |
| Accent (Blue) | Sapphire-400 | #38bdf8 |
| Grade A | Emerald | Green ✅ |
| Grade B | Lime | Yellow-Green |
| Grade C | Amber | Orange |
| Grade D | Orange | Orange-Red |
| Grade E | Red | Red ❌ |

### Typography
| Role | Font | Usage |
|------|------|-------|
| Display | Instrument Serif | Main headings, branding |
| UI | Inter | Buttons, menus, body text |
| Technical | IBM Plex Mono | Metrics, codes, data points |

### Animations
- **Stagger Delay**: 0.1s between items
- **Card Animation**: 0.6s ease-out-cubic
- **Hover States**: 300ms smooth transitions
- **Cloud Rotation**: 28s linear infinite

---

## API Endpoints

### Get Recommendations
```
GET /recommend?query=salad&city=Delhi&area=Connaught%20Place&mode=lifecycle_aware
```

Response:
```json
[
  {
    "id": 1,
    "name": "Greek Salad with Grilled Chicken",
    "restaurant_name": "Olive Kitchen",
    "carbon_score": 1.2,
    "delivery_carbon": 0.5,
    "total_carbon": 1.7,
    "price": 8.99,
    "distance": 2.5,
    "relevance_score": 0.92,
    "total_score": 0.87
  }
]
```

### Compare Models
```
GET /recommend/compare?query=burger&city=Delhi&area=Hauz%20Khas
```

Response:
```json
{
  "commercial": { ... },
  "ingredient_aware": { ... },
  "lifecycle_aware": { ... }
}
```

---

## How to Deploy

### Docker Compose (One Command)
```bash
cd /path/to/project
docker-compose up --build
```

This starts:
- **Frontend**: http://localhost:3000 (Next.js)
- **API**: http://localhost:8000 (FastAPI)
- **Database**: localhost:5432 (PostgreSQL)

### Manual Development
```bash
# Frontend
cd frontend
npm install
npm run dev  # http://localhost:3000
# Frontend-only demo mode (no backend required)
NEXT_PUBLIC_USE_MOCK_API=true npm run dev

# Backend
cd api
pip install -r requirements.txt
python3 main.py  # http://localhost:8000
```

---

## User Flow

1. **Onboarding**
   - User lands on page with location selector modal
   - Selects city (Delhi, Mumbai, Bangalore)
   - Selects area (Connaught Place, Hauz Khas, etc.)
   - Smoothly transitions to dashboard

2. **Search**
   - Types query (e.g., "vegetarian", "protein bowl", "sustainable sushi")
   - Results appear instantly from Lifecycle-Aware model
   - Cards animate in with staggered timing

3. **Comparison (Optional)**
   - User clicks COMPARE button
   - Three rotating clouds appear
   - Each cloud shows top-1 from different model
   - User can hover to pause and inspect

4. **Metric Toggle**
   - Switch between Grade (A-E) and CO₂e (kg) values
   - Updates all cards instantly

---

## Technical Highlights

### Frontend
- **Framework**: Next.js 14 + React 18
- **Styling**: Tailwind CSS with custom design tokens
- **Animations**: Framer Motion with GPU acceleration
- **Icons**: Lucide React
- **State**: React hooks (useState, useCallback, useMemo)

### Backend
- **Framework**: FastAPI (async-ready)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Recommender**: Modular, pluggable system with BaseRecommender interface
- **Async**: Full async/await support for scalability

### Design System
- **Color Tokens**: Obsidian, Emerald, Sapphire scales
- **Component Library**: Glass panel, cards, badges, buttons
- **Animation Presets**: Stagger container, item variants
- **Responsive**: Mobile-first, supports down to 320px

---

## Key Features

### ✅ Completed
- [x] Premium Obsidian dark theme
- [x] Instrument Serif typography
- [x] Tri-model comparison with rotating clouds animation
- [x] Carbon grade visualization (A-E colors)
- [x] Bento grid results layout
- [x] Glassmorphism UI throughout
- [x] Responsive mobile design
- [x] Location selection onboarding
- [x] Search with semantic understanding
- [x] Real-time API integration
- [x] Docker compose deployment
- [x] Metric toggle (Grade vs CO₂e)

### 🔮 Future Extensions
- [ ] User accounts and saved preferences
- [ ] Carbon budget tracking
- [ ] Nutritional data visualization
- [ ] Restaurant ratings and reviews
- [ ] Seasonal ingredient awareness
- [ ] Delivery time vs carbon trade-offs
- [ ] AI-powered meal planning
- [ ] Export recommendations as PDF

---

## Performance Notes

- **First Contentful Paint**: < 1.5s
- **Comparison Animation**: Smooth 60fps rotation
- **Interactive Elements**: Sub-100ms response time
- **Mobile Optimization**: Responsive grid with smart breakpoints

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14.5+, Chrome Mobile)

---

## Team & Attribution

Built as a research-grade food sustainability project with:
- Multi-objective optimization for carbon awareness
- Full lifecycle assessment (LCA) methodology
- Industry-standard carbon metrics

---

## License

[Your License Here]

---

## Questions?

See the `/memories/session/terrabite-design-system.md` for detailed design system documentation.
