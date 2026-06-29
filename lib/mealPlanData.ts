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
      '5.5 oz sirloin steak',
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
      '5.5 oz ground beef 93/7',
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
      '5.5 oz ground beef 93/7',
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
      '5.5 oz ground beef',
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
      '5.5 oz sirloin, sliced thin OR ground beef',
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
// SALMON / ALTERNATIVE PROTEIN
// ============================================

export const SALMON_RECIPES: MealRecipe[] = [
  {
    id: 'salmon-lemon-dill',
    name: 'Pan-Seared Salmon (Lemon + Dill)',
    type: 'salmon',
    description: 'Rich in omega-3s, flaky, light — great alternative to chicken/beef',
    ingredients: [
      '6 oz salmon fillet',
      '½ lemon, juice',
      '1 tsp fresh or dried dill',
      '1 tsp olive oil',
      'Salt, pepper',
    ],
    instructions: [
      'Pat salmon dry; season with salt, pepper, dill.',
      'Heat olive oil in pan, medium-high.',
      'Sear skin-side down 4–5 min until skin is crispy.',
      'Flip; cook 2–3 min on the other side.',
      'Squeeze lemon over top and serve.',
    ],
    macros: {
      protein: 42,
      carbs: 0,
      fat: 13,
      calories: 281,
    },
    prep_time_minutes: 10,
    difficulty: 'easy',
    tags: ['omega-3', 'light', 'alternative'],
  },
];

// ============================================
// CARB SIDES
// ============================================

export const CARB_SIDES: MealRecipe[] = [
  {
    id: 'carb-white-rice-high',
    name: 'White Rice (High Carb Day)',
    type: 'carb',
    description: 'High carb day — 1.5 cups cooked · Mon/Wed/Fri (heavy lift days)',
    ingredients: ['1.5 cups white rice, cooked'],
    instructions: ['Cook in rice cooker or pot', 'Serve — use full 1.5 cup portion on Mon/Wed/Fri'],
    macros: {
      protein: 6,
      carbs: 68,
      fat: 0,
      calories: 296,
    },
    prep_time_minutes: 20,
    difficulty: 'easy',
    tags: ['high-carb', 'Mon/Wed/Fri'],
  },
  {
    id: 'carb-white-rice-low',
    name: 'White Rice (Low Carb Day)',
    type: 'carb',
    description: 'Low carb day — ¾ cup cooked · Tue/Thu (cardio/conditioning days)',
    ingredients: ['¾ cup white rice, cooked'],
    instructions: ['Cook in rice cooker or pot', 'Use only ¾ cup portion on Tue/Thu'],
    macros: {
      protein: 3,
      carbs: 34,
      fat: 0,
      calories: 148,
    },
    prep_time_minutes: 20,
    difficulty: 'easy',
    tags: ['low-carb', 'Tue/Thu'],
  },
  {
    id: 'carb-sweet-potato-high',
    name: 'Sweet Potato (High Carb Day)',
    type: 'carb',
    description: 'High carb day — 2 medium sweet potatoes · Mon/Wed/Fri',
    ingredients: ['2 medium sweet potatoes, baked'],
    instructions: ['Bake at 400°F for 45–50 min', 'Serve both on Mon/Wed/Fri'],
    macros: {
      protein: 4,
      carbs: 54,
      fat: 0,
      calories: 236,
    },
    prep_time_minutes: 50,
    difficulty: 'easy',
    tags: ['high-carb', 'Mon/Wed/Fri'],
  },
  {
    id: 'carb-sweet-potato-low',
    name: 'Sweet Potato (Low Carb Day)',
    type: 'carb',
    description: 'Low carb day — 1 medium sweet potato · Tue/Thu',
    ingredients: ['1 medium sweet potato, baked'],
    instructions: ['Bake at 400°F for 45–50 min', 'Serve with butter if desired'],
    macros: {
      protein: 2,
      carbs: 27,
      fat: 0,
      calories: 118,
    },
    prep_time_minutes: 50,
    difficulty: 'easy',
    tags: ['low-carb', 'Tue/Thu'],
  },
  {
    id: 'carb-whole-wheat-pasta',
    name: 'Whole Wheat Pasta (High Carb Day)',
    type: 'carb',
    description: 'High carb day — 1.5 cups cooked, fiber-rich · Mon/Wed/Fri',
    ingredients: ['1.5 cups whole wheat pasta, cooked'],
    instructions: ['Boil according to package directions', 'Drain and serve'],
    macros: {
      protein: 10,
      carbs: 65,
      fat: 2,
      calories: 318,
    },
    prep_time_minutes: 15,
    difficulty: 'easy',
    tags: ['high-carb', 'Mon/Wed/Fri'],
  },
  {
    id: 'carb-salad-low',
    name: 'Large Salad (Low Carb Day)',
    type: 'carb',
    description: 'Low carb day — no starch, just greens + olive oil + vinegar · Tue/Thu',
    ingredients: ['Mixed greens, large portion', 'Olive oil', 'Balsamic vinegar', 'Salt, pepper'],
    instructions: ['Toss greens in olive oil + vinegar', 'Season and serve'],
    macros: {
      protein: 2,
      carbs: 8,
      fat: 7,
      calories: 85,
    },
    prep_time_minutes: 3,
    difficulty: 'easy',
    tags: ['low-carb', 'Tue/Thu'],
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
    id: 'snack-greek-yogurt-banana-honey',
    name: 'Greek Yogurt + Banana + Honey',
    type: 'snack',
    description: 'High-protein, creamy, naturally sweet — 3 PM pick-me-up',
    ingredients: ['1.5 cups Greek yogurt (0%)', '1 banana', '1 tbsp honey'],
    instructions: ['Slice banana', 'Layer yogurt, banana, and honey in bowl', 'Enjoy'],
    macros: {
      protein: 22,
      carbs: 38,
      fat: 1,
      calories: 270,
    },
    prep_time_minutes: 2,
    difficulty: 'easy',
    tags: ['high-protein', 'quick'],
  },
  {
    id: 'snack-protein-shake',
    name: 'Protein Shake (Shred Edition)',
    type: 'snack',
    description: 'High-protein shake with oats — post-workout or afternoon fuel',
    ingredients: ['1.5 scoops whey protein', '½ cup rolled oats', '½ banana', 'Water or almond milk'],
    instructions: ['Add all ingredients to blender', 'Blend 30 sec', 'Serve immediately'],
    macros: {
      protein: 35,
      carbs: 35,
      fat: 2,
      calories: 290,
    },
    prep_time_minutes: 3,
    difficulty: 'easy',
    tags: ['high-protein', 'post-workout'],
  },
  {
    id: 'snack-hard-boiled-eggs-apple',
    name: 'Hard-Boiled Eggs (3) + Apple',
    type: 'snack',
    description: 'Portable, satisfying — grab from meal-prepped eggs',
    ingredients: ['3 hard-boiled eggs', '1 apple'],
    instructions: ['Grab pre-boiled eggs (from Sunday meal prep)', 'Grab apple', 'Enjoy'],
    macros: {
      protein: 18,
      carbs: 25,
      fat: 15,
      calories: 280,
    },
    prep_time_minutes: 1,
    difficulty: 'easy',
    tags: ['portable', 'no-prep'],
  },
  {
    id: 'snack-cottage-cheese-blueberries-granola',
    name: 'Cottage Cheese + Blueberries + Granola',
    type: 'snack',
    description: 'High-protein, creamy, with a crunch',
    ingredients: ['1 cup cottage cheese (0%)', '½ cup blueberries', '⅓ cup low-sugar granola'],
    instructions: ['Combine in bowl', 'Top with blueberries and granola', 'Enjoy'],
    macros: {
      protein: 25,
      carbs: 35,
      fat: 2,
      calories: 300,
    },
    prep_time_minutes: 2,
    difficulty: 'easy',
    tags: ['high-protein', 'textured'],
  },
  {
    id: 'snack-turkey-sandwich-orange',
    name: 'Turkey Sandwich + Orange',
    type: 'snack',
    description: 'High-protein sandwich — great when you need a real meal-like snack',
    ingredients: ['2 slices whole grain bread', '4 oz deli turkey', 'Mustard', '1 orange'],
    instructions: [
      'Layer turkey and mustard on bread',
      'Build sandwich',
      'Peel and serve orange on the side',
    ],
    macros: {
      protein: 30,
      carbs: 40,
      fat: 3,
      calories: 310,
    },
    prep_time_minutes: 3,
    difficulty: 'easy',
    tags: ['high-protein', 'filling'],
  },
  {
    id: 'snack-string-cheese-almonds-orange',
    name: 'String Cheese + Almonds + Orange',
    type: 'snack',
    description: 'Portable, balanced — zero prep, great on-the-go',
    ingredients: ['2 oz string cheese', '1 oz almonds', '1 orange'],
    instructions: ['Grab all items', 'Enjoy'],
    macros: {
      protein: 15,
      carbs: 20,
      fat: 18,
      calories: 300,
    },
    prep_time_minutes: 1,
    difficulty: 'easy',
    tags: ['portable', 'no-prep'],
  },
];

// ============================================
// EXPORTED RECIPE COLLECTIONS
// ============================================

export const ALL_RECIPES = [
  BREAKFAST_RECIPE,
  ...CHICKEN_RECIPES,
  ...BEEF_RECIPES,
  ...SALMON_RECIPES,
  ...CARB_SIDES,
  ...VEGETABLE_SIDES,
  ...SNACK_RECIPES,
];

export const PROTEIN_OPTIONS = [...CHICKEN_RECIPES, ...BEEF_RECIPES, ...SALMON_RECIPES];
export const CARB_OPTIONS = CARB_SIDES;
export const VEGGIE_OPTIONS = VEGETABLE_SIDES;
export const SNACK_OPTIONS = SNACK_RECIPES;

// ============================================
// DAILY MACRO TARGETS (Shred Edition)
// ============================================

export const DAILY_MACRO_TARGETS = {
  protein: 175,
  carbsAvg: 210,
  fat: 58,
  calories: 2150,
};

export const HIGH_CARB_DAY_TARGETS = {
  label: 'High Carb Day (Mon/Wed/Fri)',
  days: ['Monday', 'Wednesday', 'Friday'],
  protein: 175,
  carbs: 240,
  fat: 55,
  calories: 2170,
  note: 'More carbs fuel your chest/arm/leg sessions',
};

export const LOW_CARB_DAY_TARGETS = {
  label: 'Low Carb Day (Tue/Thu)',
  days: ['Tuesday', 'Thursday'],
  protein: 175,
  carbs: 150,
  fat: 62,
  calories: 1950,
  note: 'Lower carbs on conditioning days; less fuel needed',
};

export const WEEKLY_MEAL_PLAN = [
  { day: 'Monday', type: 'HIGH', lunch: 'Garlic Butter Lemon Chicken (6 oz) + 1.5 cup white rice + broccoli', dinner: 'Honey Garlic Chicken (6 oz) + 2 medium sweet potatoes + spinach' },
  { day: 'Tuesday', type: 'LOW', lunch: 'Asian Ground Beef (5.5 oz) + ¾ cup rice + snap peas', dinner: 'Garlic Butter Sirloin Steak (5.5 oz) + 1 medium sweet potato + asparagus' },
  { day: 'Wednesday', type: 'HIGH', lunch: 'Honey Garlic Chicken (6 oz) + 1.5 cup white rice + salad', dinner: 'Teriyaki Chicken (6 oz) + 2 medium sweet potatoes + broccoli' },
  { day: 'Thursday', type: 'LOW', lunch: 'Greek Yogurt Bowl (1.5 cup + granola + berries + banana)', dinner: 'Honey Garlic Beef Stir-Fry (5.5 oz) + ¾ cup rice + mixed veggies' },
  { day: 'Friday', type: 'HIGH', lunch: 'Beef Marinara (5.5 oz) + 1.5 cup whole wheat pasta', dinner: 'Pan-Seared Salmon (6 oz) + 2 medium sweet potatoes + asparagus' },
  { day: 'Saturday', type: 'FLEX', lunch: 'Eating out: grilled protein + rice/potato + veggies', dinner: 'Flexible — cook something fun' },
  { day: 'Sunday', type: 'FLEX', lunch: 'Flexible — family meal prep', dinner: 'Flexible — family meal' },
];

export const GROCERY_LIST = {
  proteins: [
    { item: 'Chicken breasts, boneless skinless', qty: '4 lbs' },
    { item: 'Ground beef (93/7 lean)', qty: '2 lbs' },
    { item: 'Sirloin steak', qty: '1.5 lbs' },
    { item: 'Salmon fillets', qty: '1–1.5 lbs' },
    { item: 'Eggs, large', qty: '2 dozen' },
    { item: 'Greek yogurt, plain 0%', qty: '48 oz' },
    { item: 'Cottage cheese, 0%', qty: '16 oz' },
  ],
  carbs: [
    { item: 'White rice (bulk, uncooked)', qty: '3–4 lbs' },
    { item: 'Sweet potatoes', qty: '6–7 medium' },
    { item: 'Whole wheat pasta', qty: '1–2 boxes' },
    { item: 'Oats (rolled)', qty: '1 large container' },
    { item: 'Whole grain bread', qty: '1 loaf' },
    { item: 'Granola (low-sugar)', qty: '1 box' },
  ],
  fruits: [
    'Apples (1 dozen)', 'Bananas (3–4 bunches)', 'Blueberries (2 containers)',
    'Strawberries (1 lb)', 'Raspberries (1 container)', 'Grapes (1 lb)',
    'Oranges (1 bag)', 'Pineapple (1)', 'Lemons (4–5)',
  ],
  vegetables: [
    'Broccoli (3 crowns)', 'Spinach, fresh (2 bags)', 'Onions, yellow (3 lbs)',
    'Asparagus (1.5 bunches)', 'Green beans (1 lb)', 'Mixed vegetables, frozen (2–3 bags)',
    'Snap peas (1.5 lbs)', 'Carrots (2 lbs)', 'Cucumbers (2–3)', 'Tomatoes (3–4)',
    'Lettuce/mixed greens (1 bag)', 'Garlic (1 bulb)', 'Ginger, fresh (1 small root)',
  ],
  dairyAndSupplements: [
    'Milk (1 gallon)', 'Unsweetened almond milk (1 carton)', 'Butter (1 lb)',
    'Shredded cheese (8 oz)', 'String cheese (1 pack)',
    'Whey protein powder (2–3 lbs)', 'Casein protein powder (optional; 1 lb)',
  ],
  condiments: [
    { item: 'Olive oil', qty: '1 bottle — pan-sear, roasted veg, salads' },
    { item: 'Sesame oil', qty: '1 small bottle — Asian chicken & beef' },
    { item: 'Honey', qty: '1 jar — marinades, teriyaki, yogurt bowls' },
    { item: 'Low-sodium soy sauce', qty: '1 bottle — stir-fries, teriyaki, Asian bowls' },
    { item: 'Rice vinegar', qty: '1 bottle — soy-ginger chicken' },
    { item: 'Balsamic vinegar', qty: '1 bottle — low-carb day salads' },
    { item: 'Worcestershire sauce', qty: '1 bottle — burgers' },
    { item: 'Marinara sauce', qty: '2 jars — beef marinara pasta' },
    { item: 'Mirin (or sweet rice wine)', qty: '1 bottle — teriyaki glaze' },
    { item: 'Yellow mustard', qty: '1 bottle — burgers, turkey sandwiches' },
    { item: 'Cornstarch', qty: '1 small box — teriyaki sauce thickener' },
    { item: 'Dried dill', qty: '1 jar — grilled salmon' },
  ],
  spices: [
    'Salt & black pepper',
    'Italian seasoning — garlic butter lemon chicken',
    'Dried oregano — lemon herb & beef marinara',
    'Dried basil — lemon herb chicken & marinara',
    'Dried rosemary — garlic butter sirloin',
    'Paprika, garlic powder, onion powder',
  ],
  bakery: ['Chocolate croissants (5–7)', 'Whole grain bread (1 loaf)'],
  estimatedCost: '$170–220/week for 3 people',
};

/** Plain-text grocery list for the Blueprint plan tab. */
export function formatGroceryListText(): string {
  const g = GROCERY_LIST;
  const bullet = (item: string, qty?: string) =>
    qty ? `• ${item} — ${qty}` : `• ${item}`;

  return [
    'Shop once per week. Covers all meals for you + family.',
    '',
    '🥩 PROTEINS',
    ...g.proteins.map((p) => bullet(p.item, p.qty)),
    '',
    '🌾 CARBS',
    ...g.carbs.map((c) => bullet(c.item, c.qty)),
    '',
    '🍎 FRUITS',
    ...g.fruits.map((f) => `• ${f}`),
    '',
    '🥦 VEGETABLES',
    ...g.vegetables.map((v) => `• ${v}`),
    '',
    '🧀 DAIRY & SUPPLEMENTS',
    ...g.dairyAndSupplements.map((d) => `• ${d}`),
    '',
    '🫒 OILS, SAUCES & CONDIMENTS',
    ...g.condiments.map((c) => bullet(c.item, c.qty)),
    '',
    '🧂 SPICES & SEASONINGS',
    ...g.spices.map((s) => `• ${s}`),
    '',
    '🥐 BAKERY',
    ...g.bakery.map((b) => `• ${b}`),
    '',
    `💰 Estimate: ${g.estimatedCost}`,
  ].join('\n');
}
