# Weeknight Veg

Quick, affordable vegetarian dinners for couples and families. Browse 35 recipes, build a weekly plan, and generate a smart shopping list.

## Getting started

Requires [Node.js](https://nodejs.org/) v18+.

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build & deploy

```bash
npm run build   # output → dist/
```

Deploy `dist/` to Netlify (drag-and-drop), Vercel, or GitHub Pages. Zero config needed.

**Netlify:** Build command `npm run build`, publish directory `dist`.

## Project structure

```
src/
├── data/recipes.json        ← All 35 recipes — edit here to add/change
├── utils/ingredientUtils.js ← Merging, scaling, formatting logic
├── context/PlanContext.jsx  ← Global plan state
├── components/              ← Header, RecipeCard, ShoppingList, etc.
├── pages/                   ← HomePage, RecipePage, PlanPage
├── styles/globals.css       ← Design tokens and base styles
└── App.jsx / main.jsx
```

## Adding a recipe

Add an entry to `src/data/recipes.json`:

```json
{
  "id": "my-recipe",
  "title": "My Recipe",
  "emoji": "🍝",
  "color": "#E67E22",
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

Units: `g` `ml` `whole` `tin` `tbsp` `tsp` `bunch` `thumb` `sprig` `slice`

Categories: `vegetables` `fridge` `tins` `dry` `herbs-spices` `bakery` `frozen` `condiments`
