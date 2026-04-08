import { API_CONFIG } from "@/config/constants";

export type RecommendationMode = "commercial" | "lifecycle_aware";

export interface ApiRecommendationItem {
  id: string | number;
  name: string;
  restaurant_name?: string;
  carbon_score?: number;
  delivery_carbon?: number;
  total_carbon?: number;
  price?: number;
  distance?: number;
  relevance_score?: number;
  total_score?: number;
}

interface MockRecommendationRequest {
  query: string;
  city: string;
  area: string;
  mode: RecommendationMode;
  lambdaValue: number;
  limit: number;
}

interface MockCatalogItem {
  id: number;
  name: string;
  restaurant: string;
  category: string;
  tags: string[];
  price: number;
  baseRelevance: number;
  baseCarbon: number;
}

const MOCK_CATALOG: MockCatalogItem[] = [
  {
    id: 1,
    name: "Chicken Tikka Bowl",
    restaurant: "Spice Foundry",
    category: "Indian",
    tags: ["chicken", "tikka", "grilled", "protein"],
    price: 310,
    baseRelevance: 0.86,
    baseCarbon: 3.7,
  },
  {
    id: 2,
    name: "Paneer Lababdar Wrap",
    restaurant: "Urban Tawa",
    category: "Indian",
    tags: ["paneer", "veg", "wrap", "north indian"],
    price: 240,
    baseRelevance: 0.8,
    baseCarbon: 1.9,
  },
  {
    id: 3,
    name: "Classic Cheese Pizza",
    restaurant: "Crust Avenue",
    category: "Italian",
    tags: ["pizza", "cheese", "italian"],
    price: 420,
    baseRelevance: 0.9,
    baseCarbon: 2.8,
  },
  {
    id: 4,
    name: "Farmhouse Veg Pizza",
    restaurant: "Crust Avenue",
    category: "Italian",
    tags: ["pizza", "veg", "mushroom", "capsicum"],
    price: 410,
    baseRelevance: 0.84,
    baseCarbon: 2.3,
  },
  {
    id: 5,
    name: "Smoky Chicken Burger",
    restaurant: "Grill Lane",
    category: "Fast Food",
    tags: ["burger", "chicken", "smoky", "fast"],
    price: 290,
    baseRelevance: 0.83,
    baseCarbon: 4.1,
  },
  {
    id: 6,
    name: "Falafel Hummus Platter",
    restaurant: "Levant Kitchen",
    category: "Mediterranean",
    tags: ["falafel", "hummus", "vegan", "salad"],
    price: 260,
    baseRelevance: 0.76,
    baseCarbon: 1.3,
  },
  {
    id: 7,
    name: "Mushroom Truffle Pasta",
    restaurant: "Pasta District",
    category: "Italian",
    tags: ["pasta", "mushroom", "truffle", "creamy"],
    price: 450,
    baseRelevance: 0.79,
    baseCarbon: 2.6,
  },
  {
    id: 8,
    name: "Tofu Stir Fry Rice",
    restaurant: "Wok Republic",
    category: "Asian",
    tags: ["tofu", "stir fry", "rice", "asian"],
    price: 270,
    baseRelevance: 0.74,
    baseCarbon: 1.2,
  },
  {
    id: 9,
    name: "Butter Chicken Combo",
    restaurant: "Punjabi Junction",
    category: "Indian",
    tags: ["butter chicken", "gravy", "combo"],
    price: 390,
    baseRelevance: 0.91,
    baseCarbon: 4.6,
  },
  {
    id: 10,
    name: "Quinoa Power Salad",
    restaurant: "Leaf Theory",
    category: "Healthy",
    tags: ["quinoa", "salad", "healthy", "protein"],
    price: 330,
    baseRelevance: 0.72,
    baseCarbon: 0.9,
  },
  {
    id: 11,
    name: "Veg Biryani Handi",
    restaurant: "Biryani Circuit",
    category: "Indian",
    tags: ["biryani", "veg", "rice", "spicy"],
    price: 280,
    baseRelevance: 0.82,
    baseCarbon: 2.1,
  },
  {
    id: 12,
    name: "Sushi Veg Roll Box",
    restaurant: "Tokyo Table",
    category: "Japanese",
    tags: ["sushi", "veg", "roll", "japanese"],
    price: 470,
    baseRelevance: 0.69,
    baseCarbon: 1.6,
  },
];

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const stableHash = (value: string): number => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
};

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const computeQueryBoost = (query: string, item: MockCatalogItem): number => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return 0.12;
  }

  const tokens = normalized.split(/\s+/).filter(Boolean);
  const haystack = `${item.name} ${item.category} ${item.tags.join(" ")}`.toLowerCase();

  const tokenMatches = tokens.reduce((count, token) => {
    return count + (haystack.includes(token) ? 1 : 0);
  }, 0);

  const exactPhraseBoost = haystack.includes(normalized) ? 0.22 : 0;
  const matchRatio = tokens.length > 0 ? tokenMatches / tokens.length : 0;
  return exactPhraseBoost + matchRatio * 0.45;
};

export const getMockRecommendations = async ({
  query,
  city,
  area,
  mode,
  lambdaValue,
  limit,
}: MockRecommendationRequest): Promise<ApiRecommendationItem[]> => {
  if (API_CONFIG.MOCK_API_DELAY_MS > 0) {
    await wait(API_CONFIG.MOCK_API_DELAY_MS);
  }

  const locationSeed = stableHash(`${city}|${area}`);
  const cappedLimit = Math.max(1, limit);
  const lambda = clamp(lambdaValue, 0, 1);

  const scored = MOCK_CATALOG.map((item, index) => {
    const distance = 1.4 + ((locationSeed + index * 17) % 78) / 10;
    const deliveryCarbon = 0.2 + distance * 0.16 + (index % 3) * 0.06;
    const totalCarbon = item.baseCarbon + deliveryCarbon;

    const queryBoost = computeQueryBoost(query, item);
    const relevanceScore = clamp(item.baseRelevance + queryBoost, 0, 1.4);

    const priceUtility = clamp(1 - item.price / 600, 0, 1);
    const commercialScore = relevanceScore * 0.82 + priceUtility * 0.18;

    const carbonUtility = clamp(1 - totalCarbon / 12, 0, 1);
    const lifecycleScore = (1 - lambda) * commercialScore + lambda * carbonUtility;

    return {
      item,
      distance,
      deliveryCarbon,
      totalCarbon,
      relevanceScore,
      commercialScore,
      lifecycleScore,
    };
  });

  const sorted = [...scored].sort((a, b) => {
    if (mode === "commercial") {
      return b.commercialScore - a.commercialScore;
    }
    return b.lifecycleScore - a.lifecycleScore;
  });

  return sorted.slice(0, cappedLimit).map((entry) => {
    const rankingScore =
      mode === "commercial" ? entry.commercialScore : entry.lifecycleScore;

    return {
      id: `${mode}-${entry.item.id}`,
      name: entry.item.name,
      restaurant_name: entry.item.restaurant,
      carbon_score: Number(entry.item.baseCarbon.toFixed(2)),
      delivery_carbon: Number(entry.deliveryCarbon.toFixed(2)),
      total_carbon: Number(entry.totalCarbon.toFixed(2)),
      price: entry.item.price,
      distance: Number(entry.distance.toFixed(1)),
      relevance_score: Number(entry.relevanceScore.toFixed(4)),
      total_score: Number(rankingScore.toFixed(4)),
    };
  });
};
