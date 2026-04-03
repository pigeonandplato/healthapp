import Link from "next/link";

function DietSection({
  title,
  emoji,
  children,
}: {
  title: string;
  emoji: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-5 sm:p-6 shadow-sm border border-[#E5E5EA] dark:border-[#38383A]">
      <h2 className="text-lg font-bold text-[#1C1C1E] dark:text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">{emoji}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function MealOption({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="rounded-xl bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#E5E5EA] dark:border-[#38383A] p-4 mb-3 last:mb-0">
      <p className="text-sm font-semibold text-[#FF2D55] mb-2">{label}</p>
      <ul className="text-sm text-[#1C1C1E] dark:text-[#E5E5EA] space-y-1.5 list-disc list-inside">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function DailyDietPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black pb-28">
      <section className="bg-gradient-to-br from-[#FF2D55] via-[#FF6482] to-[#FF9500] text-white">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <Link
            href="/progress"
            className="inline-flex items-center gap-1 text-white/90 text-sm font-medium hover:text-white mb-4"
          >
            <span aria-hidden>←</span> Back to Progress
          </Link>
          <p className="text-sm font-medium text-white/90 uppercase tracking-wide mb-1">Daily diet</p>
          <h1 className="text-2xl font-bold leading-tight mb-2">
            High-protein 4-meal plan
          </h1>
          <p className="text-white/90 text-sm leading-relaxed">
            ~2,580 kcal · ~200g protein · Reflux-friendly · Whole foods + roti · No shakes
          </p>
        </div>
      </section>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        <DietSection title="Meal 1 — Breakfast (pick 1)" emoji="🥚">
          <MealOption
            label="Option A (default)"
            items={[
              "3 whole eggs",
              "200g egg whites",
              "2 slices whole grain/sourdough bread",
              "100g Greek yogurt",
              "1 banana",
            ]}
          />
          <MealOption
            label="Option B (Indian style)"
            items={[
              "2 whole eggs + 200g egg whites (bhurji style, light oil)",
              "1 roti",
              "100g yogurt",
              "1 fruit",
            ]}
          />
        </DietSection>

        <DietSection title="Meal 2 — Lunch (biggest meal)" emoji="🍗">
          <MealOption
            label="Option A (default)"
            items={["220g grilled chicken", "1.5 cups cooked rice (~300g)"]}
          />
          <MealOption
            label="Option B (roti version)"
            items={["220g grilled chicken", "3 rotis", "100g yogurt"]}
          />
        </DietSection>

        <DietSection title="Meal 3 — Dinner" emoji="🥩">
          <MealOption
            label="Option A (default)"
            items={["150g lean ground beef", "1 cup cooked rice (~200g)", "Vegetables"]}
          />
          <MealOption
            label="Option B (roti version)"
            items={["150g lean ground beef", "2 rotis", "Vegetables"]}
          />
          <MealOption
            label="Option C (low reflux day)"
            items={["200g chicken", "2 rotis", "Vegetables"]}
          />
        </DietSection>

        <DietSection title="Meal 4 — Night" emoji="🥣">
          <MealOption
            label="Option A (default)"
            items={["250g Greek yogurt", "2 boiled eggs", "1 fruit"]}
          />
          <MealOption
            label="Option B"
            items={["250g yogurt", "1 roti (optional if hungry)", "10g walnuts"]}
          />
        </DietSection>

        <DietSection title="Daily total (approx.)" emoji="📊">
          <ul className="text-sm text-[#1C1C1E] dark:text-[#E5E5EA] space-y-2 list-disc list-inside">
            <li>Calories: ~2,500–2,650 kcal</li>
            <li>Protein: ~190–210g</li>
          </ul>
        </DietSection>

        <DietSection title="Updated weekly shopping (7 days)" emoji="🛒">
          <div className="space-y-4 text-sm text-[#1C1C1E] dark:text-[#E5E5EA]">
            <div>
              <p className="font-semibold text-[#1C1C1E] dark:text-white mb-2">Protein</p>
              <ul className="space-y-1 list-disc list-inside pl-1">
                <li>Eggs: 24</li>
                <li>Egg whites: ~1.5–2 kg</li>
                <li>Chicken breast: ~1.5–2 kg</li>
                <li>Lean beef: ~1–1.2 kg</li>
                <li>Greek yogurt: ~2.5–3 kg</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-[#1C1C1E] dark:text-white mb-2">Carbs</p>
              <ul className="space-y-1 list-disc list-inside pl-1">
                <li>Whole wheat atta: ~1.5–2 kg</li>
                <li>Rice: optional (~500g–1kg if rotating)</li>
                <li>Bread: 1 loaf</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-[#1C1C1E] dark:text-white mb-2">Fruits</p>
              <ul className="space-y-1 list-disc list-inside pl-1">
                <li>Bananas (7–10)</li>
                <li>Apples (5–7)</li>
                <li>Berries (~500g)</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-[#1C1C1E] dark:text-white mb-2">Vegetables</p>
              <ul className="space-y-1 list-disc list-inside pl-1">
                <li>Spinach</li>
                <li>Zucchini</li>
                <li>Carrots</li>
                <li>Cucumber</li>
              </ul>
            </div>
          </div>
        </DietSection>

        <DietSection title="Roti recipe (simple + reflux-friendly)" emoji="🍳">
          <ul className="text-sm text-[#1C1C1E] dark:text-[#E5E5EA] space-y-2 list-disc list-inside mb-4">
            <li>1 cup whole wheat atta</li>
            <li>Water to knead</li>
            <li>No oil needed</li>
          </ul>
          <p className="text-xs font-semibold text-[#8E8E93] uppercase mb-2">Steps</p>
          <ol className="text-sm text-[#1C1C1E] dark:text-[#E5E5EA] space-y-2 list-decimal list-inside">
            <li>Knead soft dough</li>
            <li>Rest 10–15 min</li>
            <li>Roll thin</li>
            <li>Cook on hot pan (no oil or minimal ghee)</li>
          </ol>
        </DietSection>

        <DietSection title="Reflux rules (important)" emoji="⚠️">
          <ul className="text-sm text-[#1C1C1E] dark:text-[#E5E5EA] space-y-2 list-disc list-inside">
            <li>Avoid too much ghee/butter on roti</li>
            <li>Eat slowly (roti can feel heavy if rushed)</li>
            <li>Keep dinner lighter</li>
            <li>No eating 2–3 hrs before bed</li>
          </ul>
        </DietSection>

        <DietSection title="How to run this" emoji="🔁">
          <ul className="text-sm text-[#1C1C1E] dark:text-[#E5E5EA] space-y-2 list-disc list-inside">
            <li>Use rice or roti — not both in the same meal</li>
            <li>Lunch = biggest carb meal</li>
            <li>Dinner = moderate carbs</li>
            <li>Rotate options for variety</li>
          </ul>
          <p className="mt-4 text-sm text-[#8E8E93] dark:text-[#AEAEB2] italic border-t border-[#E5E5EA] dark:border-[#38383A] pt-4">
            This version is built to be sustainable, culturally flexible, and still high-performance.
          </p>
        </DietSection>
      </main>
    </div>
  );
}
