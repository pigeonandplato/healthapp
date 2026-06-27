"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BREAKFAST_RECIPE,
  PROTEIN_OPTIONS,
  CARB_OPTIONS,
  VEGGIE_OPTIONS,
  SNACK_OPTIONS,
} from "@/lib/mealPlanData";
import { MealMacros, MealRecipe, MealSelection } from "@/lib/lifestyleBlueprintTypes";
import { getMealSelectionForDate, saveMealSelectionForDate } from "@/lib/lifestyleStorage";

function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function sumMacros(...parts: (MealMacros | undefined)[]): MealMacros {
  return parts.reduce<MealMacros>(
    (acc, m) =>
      m
        ? {
            protein: acc.protein + m.protein,
            carbs: acc.carbs + m.carbs,
            fat: acc.fat + m.fat,
            calories: acc.calories + m.calories,
          }
        : acc,
    { protein: 0, carbs: 0, fat: 0, calories: 0 }
  );
}

function combineMeal(
  protein?: MealRecipe,
  carb?: MealRecipe,
  vegetable?: MealRecipe
): MealMacros | null {
  if (!protein || !carb || !vegetable) return null;
  return sumMacros(protein.macros, carb.macros, vegetable.macros);
}

/** Deterministic daily suggestion seeded by date string so it doesn't change mid-session. */
function dailySuggestion(date: string): NonNullable<MealSelection["lunch"]> {
  // Simple hash of the date string
  const hash = date.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const protein = PROTEIN_OPTIONS[hash % PROTEIN_OPTIONS.length];
  const carb = CARB_OPTIONS[(hash + 1) % CARB_OPTIONS.length];
  const vegetable = VEGGIE_OPTIONS[(hash + 2) % VEGGIE_OPTIONS.length];
  const combinedMacros = sumMacros(protein.macros, carb.macros, vegetable.macros);
  return { protein, carb, vegetable, combinedMacros };
}

function buildDefaultSelection(date: string): MealSelection {
  const suggestion = dailySuggestion(date);
  const snack = SNACK_OPTIONS[
    date.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % SNACK_OPTIONS.length
  ];
  return {
    lunch: suggestion,
    dinner: suggestion, // same suggestion, user can swap
    snack: { recipe: snack, macros: snack.macros },
  };
}

export default function MealPlanTab() {
  const [date, setDate] = useState(todayString);
  const [selection, setSelection] = useState<MealSelection>(() => buildDefaultSelection(todayString()));
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);

  useEffect(() => {
    const saved = getMealSelectionForDate(date);
    setSelection(saved ?? buildDefaultSelection(date));
    setExpandedRecipe(null);
  }, [date]);

  const persist = (next: MealSelection) => {
    setSelection(next);
    saveMealSelectionForDate(date, next);
  };

  const totals = useMemo(() => {
    const breakfast = BREAKFAST_RECIPE.macros;
    const lunch = selection.lunch?.combinedMacros;
    const snack = selection.snack?.macros;
    const dinner = selection.dinner?.combinedMacros;
    return sumMacros(breakfast, lunch, snack, dinner);
  }, [selection]);

  const pickSnack = (recipe: MealRecipe) => {
    persist({ ...selection, snack: { recipe, macros: recipe.macros } });
  };

  const pickMealPart = (
    meal: "lunch" | "dinner",
    part: "protein" | "carb" | "vegetable",
    recipe: MealRecipe
  ) => {
    const current = selection[meal];
    const updated: Partial<NonNullable<MealSelection["lunch"]>> = { ...current, [part]: recipe };
    const combined = combineMeal(updated.protein, updated.carb, updated.vegetable);
    persist({
      ...selection,
      [meal]: combined
        ? { protein: updated.protein!, carb: updated.carb!, vegetable: updated.vegetable!, combinedMacros: combined }
        : (updated as NonNullable<MealSelection["lunch"]>),
    });
  };

  return (
    <div className="space-y-5">
      <MacroSummary totals={totals} />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full text-sm px-3 py-2 rounded-xl bg-[#F2F2F7] dark:bg-[#2C2C2E] border-0 text-[#1C1C1E] dark:text-white"
      />

      {/* Breakfast — fixed every day */}
      <MealBlock title="Breakfast" emoji="🌅" subtitle="Same every day · 6:00 AM">
        <RecipeCard recipe={BREAKFAST_RECIPE} expanded onToggle={() => {}} alwaysOpen />
      </MealBlock>

      {/* Lunch */}
      <ComboMealBlock
        title="Lunch"
        emoji="🍗"
        subtitle="12:30 PM"
        meal={selection.lunch}
        onPick={(part, recipe) => pickMealPart("lunch", part, recipe)}
        expandedRecipe={expandedRecipe}
        onToggleRecipe={setExpandedRecipe}
      />

      {/* Snack */}
      <MealBlock title="Afternoon Snack" emoji="🥤" subtitle="3:00 PM — pick one">
        <div className="flex flex-wrap gap-2">
          {SNACK_OPTIONS.map((s) => (
            <Chip
              key={s.id}
              label={s.name}
              active={selection.snack?.recipe.id === s.id}
              onClick={() => pickSnack(s)}
            />
          ))}
        </div>
        {selection.snack && (
          <RecipeCard
            recipe={selection.snack.recipe}
            expanded={expandedRecipe === selection.snack.recipe.id}
            onToggle={() =>
              setExpandedRecipe(
                expandedRecipe === selection.snack?.recipe.id ? null : selection.snack!.recipe.id
              )
            }
          />
        )}
      </MealBlock>

      {/* Dinner */}
      <ComboMealBlock
        title="Dinner"
        emoji="🍽️"
        subtitle="6:30 PM"
        meal={selection.dinner}
        onPick={(part, recipe) => pickMealPart("dinner", part, recipe)}
        expandedRecipe={expandedRecipe}
        onToggleRecipe={setExpandedRecipe}
      />
    </div>
  );
}

function MacroSummary({ totals }: { totals: MealMacros }) {
  const targets = { protein: 170, carbs: 180, fat: 68 };
  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-5 border border-[#E5E5EA] dark:border-[#38383A]">
      <p className="text-xs text-[#8E8E93] mb-3">Daily macros · target 160–180g protein</p>
      <div className="grid grid-cols-4 gap-2 text-center">
        <MacroPill label="Protein" value={totals.protein} target={targets.protein} unit="g" color="#FF2D55" />
        <MacroPill label="Carbs" value={totals.carbs} target={targets.carbs} unit="g" color="#34C759" />
        <MacroPill label="Fat" value={totals.fat} target={targets.fat} unit="g" color="#FF9500" />
        <MacroPill label="Cal" value={totals.calories} target={2200} unit="" color="#5856D6" />
      </div>
    </div>
  );
}

function MacroPill({
  label, value, target, unit, color,
}: {
  label: string; value: number; target: number; unit: string; color: string;
}) {
  const pct = Math.min(100, Math.round((value / target) * 100));
  return (
    <div>
      <p className="text-lg font-bold" style={{ color }}>{Math.round(value)}{unit}</p>
      <p className="text-[10px] text-[#8E8E93]">{label}</p>
      <div className="mt-1 h-1 bg-[#E5E5EA] dark:bg-[#38383A] rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function MealBlock({ title, emoji, subtitle, children }: {
  title: string; emoji: string; subtitle?: string; children: React.ReactNode;
}) {
  return (
    <section className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-5 border border-[#E5E5EA] dark:border-[#38383A]">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-base font-bold text-[#1C1C1E] dark:text-white flex items-center gap-2">
          <span>{emoji}</span>{title}
        </h3>
        {subtitle && <span className="text-xs font-semibold text-[#FF2D55]">{subtitle}</span>}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function ComboMealBlock({
  title, emoji, subtitle, meal, onPick, expandedRecipe, onToggleRecipe,
}: {
  title: string;
  emoji: string;
  subtitle?: string;
  meal?: MealSelection["lunch"];
  onPick: (part: "protein" | "carb" | "vegetable", recipe: MealRecipe) => void;
  expandedRecipe: string | null;
  onToggleRecipe: (id: string | null) => void;
}) {
  return (
    <MealBlock title={title} emoji={emoji} subtitle={subtitle}>
      {/* Today's suggestion banner */}
      {meal?.protein && (
        <div className="bg-[#FF2D55]/8 border border-[#FF2D55]/20 rounded-xl p-3 mb-1">
          <p className="text-[10px] font-semibold text-[#FF2D55] uppercase mb-1">Today&apos;s suggestion</p>
          <p className="text-sm font-medium text-[#1C1C1E] dark:text-white">
            {meal.protein.name}
          </p>
          <p className="text-xs text-[#8E8E93]">
            + {meal.carb?.name} · {meal.vegetable?.name}
          </p>
          {meal.combinedMacros && (
            <p className="text-[10px] text-[#8E8E93] mt-1">
              {Math.round(meal.combinedMacros.protein)}g P · {Math.round(meal.combinedMacros.carbs)}g C · {Math.round(meal.combinedMacros.fat)}g F
            </p>
          )}
        </div>
      )}

      {/* Full recipe expanded by default for the protein */}
      {meal?.protein && (
        <RecipeCard
          recipe={meal.protein}
          expanded={expandedRecipe !== `${title}-collapsed`}
          onToggle={() =>
            onToggleRecipe(
              expandedRecipe === `${title}-collapsed` ? null : `${title}-collapsed`
            )
          }
        />
      )}

      {/* Swap pickers */}
      <details className="group">
        <summary className="text-xs font-semibold text-[#8E8E93] cursor-pointer list-none flex items-center gap-1 pt-1">
          <svg className="w-3 h-3 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          Change meal
        </summary>
        <div className="pt-3 space-y-3">
          <PickerRow label="Protein" options={PROTEIN_OPTIONS} selected={meal?.protein?.id} onPick={(r) => onPick("protein", r)} />
          <PickerRow label="Carb" options={CARB_OPTIONS} selected={meal?.carb?.id} onPick={(r) => onPick("carb", r)} />
          <PickerRow label="Veggie" options={VEGGIE_OPTIONS} selected={meal?.vegetable?.id} onPick={(r) => onPick("vegetable", r)} />
        </div>
      </details>
    </MealBlock>
  );
}

function PickerRow({ label, options, selected, onPick }: {
  label: string; options: MealRecipe[]; selected?: string; onPick: (r: MealRecipe) => void;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-[#FF2D55] mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <Chip key={o.id} label={o.name} active={selected === o.id} onClick={() => onPick(o)} />
        ))}
      </div>
    </div>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
        active ? "bg-[#FF2D55] text-white" : "bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-[#E5E5EA]"
      }`}
    >
      {label}
    </button>
  );
}

function RecipeCard({ recipe, expanded, onToggle, alwaysOpen }: {
  recipe: MealRecipe; expanded: boolean; onToggle: () => void; alwaysOpen?: boolean;
}) {
  return (
    <div className="rounded-xl bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#E5E5EA] dark:border-[#38383A] overflow-hidden">
      {!alwaysOpen && (
        <button type="button" onClick={onToggle} className="w-full p-3 text-left">
          <p className="text-sm font-semibold text-[#1C1C1E] dark:text-white">{recipe.name}</p>
          <p className="text-xs text-[#8E8E93] mt-0.5">{recipe.description}</p>
          <p className="text-[10px] text-[#8E8E93] mt-1">
            {recipe.macros.protein}g P · {recipe.macros.carbs}g C · {recipe.macros.fat}g F · {recipe.prep_time_minutes} min
          </p>
        </button>
      )}
      {(expanded || alwaysOpen) && (
        <div className={`space-y-3 ${alwaysOpen ? "p-3" : "px-3 pb-3 border-t border-[#E5E5EA] dark:border-[#38383A] pt-3"}`}>
          {alwaysOpen && (
            <>
              <p className="text-sm font-semibold text-[#1C1C1E] dark:text-white">{recipe.name}</p>
              <p className="text-[10px] text-[#8E8E93]">
                {recipe.macros.protein}g P · {recipe.macros.carbs}g C · {recipe.macros.fat}g F · {recipe.prep_time_minutes} min
              </p>
            </>
          )}
          <div>
            <p className="text-xs font-semibold text-[#8E8E93] uppercase mb-1">Ingredients</p>
            <ul className="text-xs text-[#1C1C1E] dark:text-[#E5E5EA] space-y-1 list-disc list-inside">
              {recipe.ingredients.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8E8E93] uppercase mb-1">Steps</p>
            <ol className="text-xs text-[#1C1C1E] dark:text-[#E5E5EA] space-y-1 list-decimal list-inside">
              {recipe.instructions.map((s) => <li key={s}>{s}</li>)}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
