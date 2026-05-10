const UNIT_CONVERSIONS = {
  kg: { to: 'g', factor: 1000 },
  l: { to: 'ml', factor: 1000 },
};

const NORMALIZE_MAP = {
  'garlic cloves': 'garlic clove',
  'red onions': 'red onion',
  'onions': 'onion',
  'eggs': 'egg',
  'cherry tomatoes': 'cherry tomato',
  'tinned chopped tomatoes': 'tinned chopped tomato',
  'tinned chickpeas': 'tinned chickpea',
  'tinned black beans': 'tinned black bean',
  'tinned kidney beans': 'tinned kidney bean',
  'tinned cannellini beans': 'tinned cannellini bean',
  'courgettes': 'courgette',
  'aubergines': 'aubergine',
  'mushrooms': 'mushroom',
  'limes': 'lime',
  'lemons': 'lemon',
  'carrots': 'carrot',
  'potatoes': 'potato',
  'spring onions': 'spring onion',
  'sweet potatoes': 'sweet potato',
  'avocados': 'avocado',
};

export function normalizeIngredientKey(name) {
  const lower = name.toLowerCase().trim();
  return NORMALIZE_MAP[lower] ?? lower;
}

function convertUnit(quantity, unit) {
  const conv = UNIT_CONVERSIONS[unit];
  if (conv) return { quantity: quantity * conv.factor, unit: conv.to };
  return { quantity, unit };
}

export function scaleQuantity(quantity, baseServings, targetServings) {
  if (quantity === null) return null;
  const scale = targetServings / baseServings;
  return quantity * scale;
}

export function roundQuantity(quantity, unit) {
  if (quantity === null) return null;
  switch (unit) {
    case 'g':
    case 'ml':
      if (quantity >= 100) return Math.round(quantity / 10) * 10;
      if (quantity >= 20) return Math.round(quantity / 5) * 5;
      return Math.round(quantity * 2) / 2;
    case 'whole':
    case 'tin':
      return Math.ceil(quantity);
    case 'tbsp':
    case 'tsp':
      return Math.round(quantity * 4) / 4;
    default:
      return Math.round(quantity * 4) / 4;
  }
}

export function formatQuantity(quantity, unit) {
  if (quantity === null) return unit;
  const rounded = roundQuantity(quantity, unit);

  switch (unit) {
    case 'g':
      if (rounded >= 1000) {
        const kg = rounded / 1000;
        return `${kg % 1 === 0 ? kg : kg.toFixed(1)}kg`;
      }
      return `${rounded}g`;
    case 'ml':
      if (rounded >= 1000) {
        const l = rounded / 1000;
        return `${l % 1 === 0 ? l : l.toFixed(1)}l`;
      }
      return `${rounded}ml`;
    case 'whole':
      return `${rounded}`;
    case 'tin':
      return rounded === 1 ? '1 tin' : `${rounded} tins`;
    case 'tbsp':
      return `${formatFraction(rounded)} tbsp`;
    case 'tsp':
      return `${formatFraction(rounded)} tsp`;
    case 'bunch':
      return `${Math.ceil(quantity)} bunch${Math.ceil(quantity) > 1 ? 'es' : ''}`;
    case 'thumb':
      return `${Math.ceil(quantity)} thumb${Math.ceil(quantity) > 1 ? 's' : ''}`;
    case 'sprig':
      return `${Math.ceil(quantity)} sprig${Math.ceil(quantity) > 1 ? 's' : ''}`;
    case 'slice':
      return `${Math.ceil(quantity)} slice${Math.ceil(quantity) > 1 ? 's' : ''}`;
    default:
      return `${rounded} ${unit}`;
  }
}

function formatFraction(n) {
  const floor = Math.floor(n);
  const frac = n - floor;
  const FRACS = [[0.25, '¼'], [0.5, '½'], [0.75, '¾']];
  for (const [val, sym] of FRACS) {
    if (Math.abs(frac - val) < 0.1) {
      return floor > 0 ? `${floor}${sym}` : sym;
    }
  }
  if (frac < 0.1) return `${floor}`;
  return n.toFixed(1);
}

export const CATEGORY_ORDER = [
  'vegetables',
  'fridge',
  'tins',
  'dry',
  'herbs-spices',
  'bakery',
  'frozen',
  'condiments',
];

export const CATEGORY_LABELS = {
  vegetables: 'Fresh Produce',
  fridge: 'Fridge',
  tins: 'Tins & Jars',
  dry: 'Dry Goods',
  'herbs-spices': 'Herbs & Spices',
  bakery: 'Bakery',
  frozen: 'Frozen',
  condiments: 'Condiments & Oils',
};

export function mergeAllIngredients(plannedMeals, recipesMap) {
  const merged = {};

  for (const { recipeId, servings } of plannedMeals) {
    const recipe = recipesMap[recipeId];
    if (!recipe) continue;

    for (const ingredient of recipe.ingredients) {
      const scaledQty = scaleQuantity(ingredient.quantity, recipe.baseServings, servings);
      const { quantity: normQty, unit: normUnit } = convertUnit(
        scaledQty ?? 0,
        ingredient.unit
      );

      const key = normalizeIngredientKey(ingredient.name);
      const unitKey = `${key}__${normUnit}`;

      if (merged[unitKey]) {
        merged[unitKey] = {
          ...merged[unitKey],
          quantity: scaledQty === null ? null : merged[unitKey].quantity + normQty,
          pantryStaple: merged[unitKey].pantryStaple && ingredient.pantryStaple,
        };
      } else {
        merged[unitKey] = {
          ...ingredient,
          name: key,
          displayName: key,
          quantity: scaledQty === null ? null : normQty,
          unit: normUnit,
          key: unitKey,
          pantryStaple: ingredient.pantryStaple,
        };
      }
    }
  }

  return Object.values(merged);
}

export function groupByCategory(ingredients) {
  const groups = {};
  for (const ing of ingredients) {
    const cat = ing.category ?? 'misc';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(ing);
  }

  const ordered = [];
  for (const cat of CATEGORY_ORDER) {
    if (groups[cat]?.length) {
      ordered.push({ category: cat, label: CATEGORY_LABELS[cat] ?? cat, items: groups[cat] });
    }
  }
  for (const [cat, items] of Object.entries(groups)) {
    if (!CATEGORY_ORDER.includes(cat)) {
      ordered.push({ category: cat, label: cat, items });
    }
  }
  return ordered;
}
