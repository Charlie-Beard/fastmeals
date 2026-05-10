# Weeknight Veg

Quick, affordable vegetarian dinners for couples and families. Browse 62 recipes, build a weekly plan, and generate a smart shopping list.

**Live:** https://charlie-beard.github.io/fastmeals/

## Features

- **62 vegetarian recipes** — pasta, curries, Asian noodles, soups, tacos, tray bakes, and more
- **Smart shopping list** — ingredients merged, scaled, and grouped by category
- **Global servings control** — set portions once on the plan page; shopping list updates instantly
- **Shuffle** — randomise the recipe grid for inspiration
- **Random recipe** — add a surprise meal to your plan in one tap
- **Recipe photos** — full-bleed Unsplash hero images on every recipe page, preloaded in the background for instant display
- **PWA** — installable, works offline, images cached for 30 days
- **SEO** — crawlable URLs, per-page meta tags, Open Graph / Twitter Card, JSON-LD Recipe schema, sitemap.xml

## Getting started

Requires [Node.js](https://nodejs.org/) v18+.

```bash
npm install
npm run dev
```

Open [http://localhost:5173/fastmeals/](http://localhost:5173/fastmeals/).

## Build & deploy

```bash
npm run build        # production build → dist/ (also writes dist/404.html for GitHub Pages deep links)
npm run preview      # preview the built output locally
```

Deployed automatically to GitHub Pages via `.github/workflows/deploy.yml` on every push to `main`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build + copy 404.html |
| `npm run preview` | Preview production build locally |
| `npm run generate-sitemap` | Regenerate `public/sitemap.xml` after adding recipes |

## Project structure

```
src/
├── data/recipes.json        ← All 62 recipes — edit here to add/change
├── utils/ingredientUtils.js ← Merging, scaling, formatting logic
├── context/PlanContext.jsx  ← Global plan & servings state
├── components/              ← Header, RecipeCard, SearchFilter, ShoppingList, etc.
├── pages/                   ← HomePage, RecipePage, PlanPage
├── styles/globals.css       ← Design tokens and base styles
└── App.jsx / main.jsx
scripts/
└── generate-sitemap.js      ← Generates public/sitemap.xml from recipes.json
public/
├── robots.txt
└── sitemap.xml
```

## Adding a recipe

1. Add an entry to `src/data/recipes.json`
2. Run `npm run generate-sitemap` to update the sitemap

```json
{
  "id": "my-recipe",
  "title": "My Recipe",
  "emoji": "🍝",
  "color": "#E67E22",
  "image": "https://images.unsplash.com/photo-XXXX?w=800&q=80&auto=format&fit=crop",
  "description": "Short one-liner.",
  "tags": ["under-30-mins", "budget"],
  "baseServings": 2,
  "prepTime": 5, "cookTime": 20, "totalTime": 25,
  "calories": 500, "fruitVegPortions": 2, "difficulty": "Easy",
  "ingredients": [
    { "name": "pasta", "quantity": 200, "unit": "g", "category": "dry", "pantryStaple": false }
  ],
  "equipment": ["Large saucepan"],
  "steps": ["Step 1.", "Step 2."],
  "tips": ["Tip here."],
  "storage": "3 days in fridge.",
  "reheating": "Reheat in a pan."
}
```

**Units:** `g` `ml` `whole` `tin` `tbsp` `tsp` `bunch` `thumb` `sprig` `slice`

**Categories:** `vegetables` `fridge` `tins` `dry` `herbs-spices` `bakery` `frozen` `condiments`

**Tags:** `under-20-mins` `under-30-mins` `budget` `high-protein` `vegan` `kid-friendly` `one-pan` `spicy` `mild` `healthy` `batch-friendly` `comfort-food` `indian` `asian` `mexican` `mediterranean`

**Ingredient normalisation:** Always use singular nouns (`tomato` not `tomatoes`, `garlic clove` not `garlic cloves`) so the shopping list merges correctly across recipes.
