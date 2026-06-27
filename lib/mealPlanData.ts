// Meal Plan Data - All recipes from Gilly's Lifestyle Blueprint
import { MealRecipe, MealMacros } from './lifestyleBlueprintTypes';

// ============================================
// BREAKFAST (Fixed)
// ============================================

export const BREAKFAST_RECIPE: MealRecipe = {
  id: 'breakfast-gillystandard',
  name: 'Gilly\'s Standard Breakfast',
  type: 'breakfast',
  category: 'breakfast',
  description: 'Cappuccino + Chocolate Croissant + Eggs + Apple',
  ingredients: [
    'Cappuccino with 1 tsp sugar',
    '1 medium chocolate croissant',
    '2 large hard-boiled eggs',
    '1 medium apple',
  ],
  instructions: [
    'Make cappuccino with sugar',
    'Boil or grab pre-boiled eggs',
    'Get chocolate croissant from bakery',
    'Grab apple',
    'Combine and serve',
  ],
  macros: {
    protein: 15,
    carbs: 65,
    fat: 15,
    calories: 570,
  },
  prep_time_minutes: 5,
  difficulty: 'easy',
  tags: ['fixed', 'daily'],
};

// ============================================
// CHICKEN RECIPES (Lunch/Dinner)
// ============================================

export const CHICKEN_RECIPES: MealRecipe[] = [
  {
    id: 'chicken-garlic-butter-lemon',
    name: 'Garlic Butter Lemon Chicken',
    type: 'chicken',
    description: 'Restaurant-quality, buttery, bright lemon flavor',
    ingredients: [
      '6 oz chicken breast',
      '1 tbsp butter',
      '3 cloves garlic, minced',
      '½ lemon, juice only',
      'Salt, pepper, Italian seasoning',
    ],
    instructions: [
      'Heat butter in pan, medium-high',
      'Season chicken with salt, pepper, Italian seasoning',
      'Cook 6–7 min per side (internal temp 165°F)',
      'Add minced garlic last 2 min',
      'Squeeze lemon juice on top',
      'Serve',
    ],
    macros: {
      protein: 42,
      carbs: 0,
      fat: 8,
      calories: 274,
    },
    prep_time_minutes: 12,
    difficulty: 'easy',
    tags: ['lean', 'quick'],
  },
  {
    id: 'chicken-soy-ginger-asian',
    name: 'Soy-Ginger Asian Chicken',
    type: 'chicken',
    description: 'Takeout-quality, savory, ginger forward',
    ingredients: [
      '6 oz chicken breast',
      '2 tbsp low-sodium soy sauce',
      '1 tbsp honey',
      '1 tbsp rice vinegar',
      '1 tsp sesame oil',
      '1 tbsp fresh ginger, minced',
      '2 cloves garlic, minced',
    ],
    instructions: [
      'Mix soy sauce + honey + rice vinegar + sesame oil',
      'Heat oil in pan, cook chicken 6–7 min per side',
      'Add garlic + ginger last 2 min',
      'Pour sauce over chicken last 1 min',
      'Serve',
    ],
    macros: {
      protein: 42,
      carbs: 8,
      fat: 5,
      calories: 277,
    },
    prep_time_minutes: 10,
    difficulty: 'easy',
    tags: ['asian', 'flavorful'],
  },
  {
    id: 'chicken-honey-garlic',
    name: 'Honey Garlic Chicken',
    type: 'chicken',
    description: 'Sweet & savory, glazy, comfort food',
    ingredients: [
      '6 oz chicken breast',
      '2 tbsp honey',
      '3 cloves garlic, minced',
      '2 tbsp low-sodium soy sauce',
      '1 tsp olive oil',
      'Salt, pepper',
    ],
    instructions: [
      'Heat oil in pan, medium-high',
      'Season chicken with salt, pepper',
      'Cook 6–7 min per side',
      'Mix honey + garlic + soy sauce',
      'Pour over chicken last 2 min, let caramelize',
      'Serve',
    ],
    macros: {
      protein: 42,
      carbs: 12,
      fat: 4,
      calories: 286,
    },
    prep_time_minutes: 10,
    difficulty: 'easy',
    tags: ['sweet', 'glazed'],
  },
  {
    id: 'chicken-lemon-herb',
    name: 'Lemon Herb Chicken',
    type: 'chicken',
    description: 'Fresh, herbaceous, Greek-inspired',
    ingredients: [
      '6 oz chicken breast',
      '1 tbsp olive oil',
      '2 cloves garlic, minced',
      '1 tsp dried oregano',
      '½ tsp dried basil',
      '½ lemon, juice',
      'Salt, pepper',
    ],
    instructions: [
      'Mix olive oil + garlic + oregano + basil',
      'Brush on chicken, season with salt + pepper',
      'Pan-sear 6–7 min per side, medium-high',
      'Squeeze lemon over top',
      'Serve',
    ],
    macros: {
      protein: 42,
      carbs: 0,
      fat: 6,
      calories: 276,
    },
    prep_time_minutes: 10,
    difficulty: 'easy',
    tags: ['herb', 'mediterranean'],
  },
  {
    id: 'chicken-teriyaki',
    name: 'Teriyaki Chicken',
    type: 'chicken',
    description: 'Sweet & savory, glossy, Asian-inspired (Mild, Not Spicy)',
    ingredients: [
      '6 oz chicken breast',
      '3 tbsp low-sodium soy sauce',
      '1 tbsp honey',
      '1 tbsp mirin (or 1 tbsp honey)',
      '1 tsp sesame oil',
      '1 clove garlic, minced',
      '1 tsp ginger, minced',
      '1 tsp cornstarch + 1 tbsp water',
    ],
    instructions: [
      'Mix soy sauce + honey + mirin + sesame oil',
      'Heat oil in pan, cook chicken 6–7 min per side',
      'Remove chicken, set aside',
      'Add garlic + ginger to pan, cook 30 sec',
      'Pour sauce in pan, add cornstarch slurry, simmer 1 min',
      'Return chicken to pan, coat in sauce',
      'Serve',
    ],
    macros: {
      protein: 42,
      carbs: 10,
      fat: 5,
      calories: 287,
    },
    prep_time_minutes: 12,
    difficulty: 'medium',
    tags: ['asian', 'glossy'],
  },
];

// ============================================
// BEEF RECIPES (Lunch/Dinner)
// ============================================

export const BEEF_RECIPES: MealRecipe[] = [
  {
    id: 'beef-garlic-butter-sirloin',
    name: 'Garlic Butter Sirloin Steak',
    type: 'beef',
    description: 'Steakhouse-quality, juicy, buttery',
    ingredients: [
      '5 oz sirloin steak',
      '1 tbsp butter',
      '3 cloves garlic, minced',
      'Salt, pepper',
      '½ tsp rosemary (optional)',
    ],
    instructions: [
      'Heat butter in pan, high heat',
      'Season steak with salt, pepper, rosemary',
      'Sear 3–4 min per side (medium-rare)',
      'Add minced garlic last minute',
      'Rest 2 min, serve',
    ],
    macros: {
      protein: 42,
      carbs: 0,
      fat: 9,
      calories: 303,
    },
    prep_time_minutes: 12,
    difficulty: 'easy',
    tags: ['steak', 'premium'],
  },
  {
    id: 'beef-asian-ground-bowl',
    name: 'Asian Ground Beef Bowl',
    type: 'beef',
    description: 'Takeout-quality, savory-sweet',
    ingredients: [
      '5 oz ground beef 93/7',
      '2 tbsp low-sodium soy sauce',
      '1 tbsp honey',
      '1 tsp sesame oil',
      '1 tbsp ginger, minced',
      '2 cloves garlic, minced',
      '2 cups mixed vegetables',
    ],
    instructions: [
      'Heat oil in wok/large pan, high heat',
      'Brown beef, 3–4 min (break up as it cooks)',
      'Add garlic + ginger, cook 1 min',
      'Add vegetables, stir-fry 3–4 min',
      'Mix soy sauce + honey, pour over, toss 1 min',
      'Serve',
    ],
    macros: {
      protein: 42,
      carbs: 12,
      fat: 7,
      calories: 311,
    },
    prep_time_minutes: 12,
    difficulty: 'easy',
    tags: ['stir-fry', 'veggie-packed'],
  },
  {
    id: 'beef-simple-burger',
    name: 'Simple Burger (Homemade)',
    type: 'beef',
    description: 'Classic burger, juicy, nostalgic',
    ingredients: [
      '5 oz ground beef 93/7',
      '1 slice whole wheat bread',
      'Lettuce, tomato, mustard',
      'Salt, pepper',
      '1 tbsp Worcestershire sauce',
    ],
    instructions: [
      'Mix beef with salt, pepper, Worcestershire',
      'Form into patty (don\'t overwork)',
      'Pan-sear high heat, 3–4 min per side',
      'Toast bread lightly',
      'Build: bread + beef + lettuce + tomato + mustard',
      'Serve with sweet potato fries or salad',
    ],
    macros: {
      protein: 42,
      carbs: 15,
      fat: 9,
      calories: 339,
    },
    prep_time_minutes: 8,
    difficulty: 'easy',
    tags: ['burger', 'classic'],
  },
  {
    id: 'beef-marinara',
    name: 'Beef Marinara',
    type: 'beef',
    description: 'Italian, rich, comfort food',
    ingredients: [
      '5 oz ground beef',
      '1 cup marinara sauce',
      '2 cloves garlic, minced',
      '1 tsp dried basil',
      '1 tsp dried oregano',
      'Salt, pepper',
      '1 cup whole wheat pasta OR zucchini noodles',
    ],
    instructions: [
      'Brown beef in pan, 3–4 min',
      'Add garlic, basil, oregano, cook 1 min',
      'Pour marinara, simmer 3 min',
      'Serve over pasta or zucchini noodles',
      'Top with parmesan if desired',
    ],
    macros: {
      protein: 42,
      carbs: 30,
      fat: 7,
      calories: 381,
    },
    prep_time_minutes: 12,
    difficulty: 'easy',
    tags: ['italian', 'pasta'],
  },
  {
    id: 'beef-honey-garlic-stirfry',
    name: 'Honey Garlic Beef Stir-Fry',
    type: 'beef',
    description: 'Sweet & savory, glazed, Asian-inspired',
    ingredients: [
      '5 oz sirloin, sliced thin OR ground beef',
      '2 tbsp low-sodium soy sauce',
      '1 tbsp honey',
      '1 tsp sesame oil',
      '1 tbsp garlic, minced',
      '1 tsp ginger, minced',
      '2 cups vegetables (broccoli, peppers, onions, snap peas)',
    ],
    instructions: [
      'Heat oil in wok, high heat',
      'Cook beef until browned, 3–4 min',
      'Add garlic + ginger, cook 1 min',
      'Add vegetables, stir-fry 3–4 min',
      'Mix soy sauce + honey, pour over, toss 1 min',
      'Serve over rice',
    ],
    macros: {
      protein: 42,
      carbs: 10,
      fat: 7,
      calories: 307,
    },
    prep_time_minutes: 12,
    difficulty: 'easy',
    tags: ['stir-fry', 'glazed'],
  },
];

// ============================================
// CARB SIDES
// ============================================

export const CARB_SIDES: MealRecipe[] = [
  {
    id: 'carb-white-rice',
    name: 'White Rice',
    type: 'carb',
    description: 'Classic, versatile carb side',
    ingredients: ['1 cup white rice, cooked'],
    instructions: ['Cook in rice cooker or pot', 'Serve'],
    macros: {
      protein: 4,
      carbs: 45,
      fat: 0,
      calories: 196,
    },
    prep_time_minutes: 20,
    difficulty: 'easy',
  },
  {
    id: 'carb-sweet-potato',
    name: 'Sweet Potato',
    type: 'carb',
    description: 'Nutrient-dense, naturally sweet',
    ingredients: ['1 medium sweet potato, baked'],
    instructions: ['Bake at 400°F for 45 min', 'Serve with butter if desired'],
    macros: {
      protein: 2,
      carbs: 27,
      fat: 0,
      calories: 118,
    },
    prep_time_minutes: 45,
    difficulty: 'easy',
  },
  {
    id: 'carb-whole-wheat-pasta',
    name: 'Whole Wheat Pasta',
    type: 'carb',
    description: 'Fiber-rich carb option',
    ingredients: ['1 cup whole wheat pasta, cooked'],
    instructions: ['Boil according to package directions', 'Drain and serve'],
    macros: {
      protein: 7,
      carbs: 43,
      fat: 2,
      calories: 218,
    },
    prep_time_minutes: 15,
    difficulty: 'easy',
  },
];

// ============================================
// VEGETABLE SIDES (Unlimited)
// ============================================

export const VEGETABLE_SIDES: MealRecipe[] = [
  {
    id: 'veg-steamed-broccoli',
    name: 'Steamed Broccoli',
    type: 'vegetable',
    description: 'Classic, nutrient-dense',
    ingredients: ['2 cups fresh broccoli'],
    instructions: ['Steam for 5–7 min until tender-crisp', 'Serve'],
    macros: {
      protein: 4,
      carbs: 8,
      fat: 0,
      calories: 55,
    },
    prep_time_minutes: 7,
    difficulty: 'easy',
  },
  {
    id: 'veg-roasted-asparagus',
    name: 'Roasted Asparagus',
    type: 'vegetable',
    description: 'Tender, lightly charred',
    ingredients: ['1 bunch asparagus', 'Olive oil, salt, pepper'],
    instructions: [
      'Toss in olive oil, salt, pepper',
      'Roast at 400°F for 12 min',
      'Serve',
    ],
    macros: {
      protein: 2,
      carbs: 4,
      fat: 1,
      calories: 27,
    },
    prep_time_minutes: 15,
    difficulty: 'easy',
  },
  {
    id: 'veg-sauteed-spinach',
    name: 'Sautéed Spinach',
    type: 'vegetable',
    description: 'Wilted, garlicky',
    ingredients: ['2 cups fresh spinach', '2 cloves garlic, minced', '1 tsp olive oil'],
    instructions: [
      'Heat oil in pan',
      'Add garlic, cook 30 sec',
      'Add spinach, sauté until wilted',
      'Serve',
    ],
    macros: {
      protein: 3,
      carbs: 2,
      fat: 1,
      calories: 23,
    },
    prep_time_minutes: 5,
    difficulty: 'easy',
  },
  {
    id: 'veg-roasted-peppers-onions',
    name: 'Roasted Peppers & Onions',
    type: 'vegetable',
    description: 'Caramelized, sweet',
    ingredients: ['2 bell peppers, sliced', '1 onion, sliced', 'Olive oil, salt, pepper'],
    instructions: [
      'Toss in olive oil, salt, pepper',
      'Roast at 400°F for 20 min',
      'Serve',
    ],
    macros: {
      protein: 1,
      carbs: 6,
      fat: 1,
      calories: 35,
    },
    prep_time_minutes: 25,
    difficulty: 'easy',
  },
  {
    id: 'veg-steamed-green-beans',
    name: 'Steamed Green Beans',
    type: 'vegetable',
    description: 'Crisp, light',
    ingredients: ['2 cups green beans'],
    instructions: ['Steam for 5–7 min', 'Serve'],
    macros: {
      protein: 2,
      carbs: 6,
      fat: 0,
      calories: 31,
    },
    prep_time_minutes: 7,
    difficulty: 'easy',
  },
];

// ============================================
// SNACKS
// ============================================

export const SNACK_RECIPES: MealRecipe[] = [
  {
    id: 'snack-greek-yogurt-berries',
    name: 'Greek Yogurt + Berries + Honey',
    type: 'snack',
    description: 'Protein-rich, sweet',
    ingredients: ['1 cup Greek yogurt', 'Mixed berries', '1 tbsp honey'],
    instructions: ['Combine in bowl', 'Enjoy'],
    macros: {
      protein: 20,
      carbs: 25,
      fat: 2,
      calories: 200,
    },
    prep_time_minutes: 2,
    difficulty: 'easy',
  },
  {
    id: 'snack-protein-shake',
    name: 'Protein Shake',
    type: 'snack',
    description: 'Quick, convenient',
    ingredients: ['1 scoop whey protein', '1 banana', '½ cup oats', 'Milk or almond milk'],
    instructions: ['Blend all ingredients', 'Serve immediately'],
    macros: {
      protein: 25,
      carbs: 45,
      fat: 3,
      calories: 250,
    },
    prep_time_minutes: 3,
    difficulty: 'easy',
  },
  {
    id: 'snack-hard-boiled-eggs-apple',
    name: 'Hard-Boiled Eggs + Apple',
    type: 'snack',
    description: 'Portable, satisfying',
    ingredients: ['2 hard-boiled eggs', '1 apple'],
    instructions: ['Grab pre-boiled eggs', 'Grab apple', 'Enjoy'],
    macros: {
      protein: 13,
      carbs: 25,
      fat: 8,
      calories: 220,
    },
    prep_time_minutes: 1,
    difficulty: 'easy',
  },
  {
    id: 'snack-cottage-cheese-pineapple',
    name: 'Cottage Cheese + Pineapple + Almonds',
    type: 'snack',
    description: 'Protein-packed, sweet',
    ingredients: ['1 cup cottage cheese', '½ cup pineapple', '1 oz almonds'],
    instructions: ['Combine in bowl', 'Enjoy'],
    macros: {
      protein: 20,
      carbs: 25,
      fat: 8,
      calories: 250,
    },
    prep_time_minutes: 2,
    difficulty: 'easy',
  },
  {
    id: 'snack-protein-bar-banana',
    name: 'Protein Bar + Banana',
    type: 'snack',
    description: 'Convenient, quick',
    ingredients: ['1 protein bar (Quest or Kirkland)', '1 banana'],
    instructions: ['Grab both items', 'Enjoy'],
    macros: {
      protein: 20,
      carbs: 40,
      fat: 5,
      calories: 280,
    },
    prep_time_minutes: 1,
    difficulty: 'easy',
  },
  {
    id: 'snack-string-cheese-almonds-orange',
    name: 'String Cheese + Almonds + Orange',
    type: 'snack',
    description: 'Portable, balanced',
    ingredients: ['2 oz string cheese', '1 oz almonds', '1 orange'],
    instructions: ['Combine all items', 'Enjoy'],
    macros: {
      protein: 15,
      carbs: 20,
      fat: 9,
      calories: 180,
    },
    prep_time_minutes: 1,
    difficulty: 'easy',
  },
];

// ============================================
// EXPORTED RECIPE COLLECTIONS
// ============================================

export const ALL_RECIPES = [
  BREAKFAST_RECIPE,
  ...CHICKEN_RECIPES,
  ...BEEF_RECIPES,
  ...CARB_SIDES,
  ...VEGETABLE_SIDES,
  ...SNACK_RECIPES,
];

export const PROTEIN_OPTIONS = [...CHICKEN_RECIPES, ...BEEF_RECIPES];
export const CARB_OPTIONS = CARB_SIDES;
export const VEGGIE_OPTIONS = VEGETABLE_SIDES;
export const SNACK_OPTIONS = SNACK_RECIPES;
