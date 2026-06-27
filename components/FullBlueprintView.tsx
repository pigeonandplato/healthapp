'use client';

import React, { useState } from 'react';

export default function FullBlueprintView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>('overview');

  const blueprintSections = [
    {
      id: 'overview',
      title: '🎯 Overview',
      content: `Gilly's Complete Lifestyle Blueprint
Get Shredded for Your Wife & Kid

Med: Lisdexamfetamine (Vyvanse) 20 mg
Goal: Visible 6-pack, strong, energized
Timeline: 12–24 weeks
Philosophy: Novelty within structure. No boring repetition.`,
    },
    {
      id: 'sleep',
      title: '⏰ Sleep (Non-Negotiable)',
      content: `Every night, no exceptions:
• 9:45 PM – Phone in another room
• 10:00 PM – Lights out, bed
• 6:00 AM – Wake up
• Same time every day, including weekends

Why: This is where muscle grows, cortisol resets, and ADHD improves.`,
    },
    {
      id: 'vyvanse',
      title: '💊 Vyvanse Timing',
      content: `6:00 AM with breakfast
• Kicks in 30–45 min later (gym time, dopamine up)
• Peaks 8–10 AM (work focus)
• Wears off by 6–7 PM (dinner, family, wind-down)
• Clean by 10 PM sleep

Don't: Take after 8 AM (sleep interference)`,
    },
    {
      id: 'macros',
      title: '📊 Daily Macro Targets',
      content: `Target: ~160–180g protein, ~160–200g carbs, ~60–75g fat

Breakfast: 15g P | 65g C | 15g F
Lunch: 42g P | 40g C | 8g F
Snack: 20g P | 25g C | 5g F
Dinner: 42g P | 40g C | 8g F

Gap: Make up protein difference with:
• Extra protein shake before bed (25g protein)
• Extra egg at breakfast
• Higher-protein snack

Don't obsess over exact numbers. If you're within 10g of target, you're good.`,
    },
    {
      id: 'your-why',
      title: '🎯 Your Why',
      content: `"Look amazing for my wife and kid."

In 12 weeks: visible abs, noticeably stronger, more energy to play with your kid, more confidence with your wife.
In 24 weeks: 6-pack, lean, strong, healthy.

That's the goal. That's what you're building.`,
    },
  ];

  const filteredSections = blueprintSections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">📖 Complete Lifestyle Blueprint</h1>
          <p className="text-gray-600">Your comprehensive reference guide for success</p>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search blueprint..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Sections */}
        <div className="space-y-3">
          {filteredSections.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No sections match your search
            </div>
          ) : (
            filteredSections.map(section => (
              <div
                key={section.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedSection(
                    expandedSection === section.id ? null : section.id
                  )}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                >
                  <h2 className="font-semibold text-lg">{section.title}</h2>
                  <span className="text-2xl">
                    {expandedSection === section.id ? '−' : '+'}
                  </span>
                </button>

                {expandedSection === section.id && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 pt-6 border-t">
          <p>Last Updated: June 27, 2026</p>
          <p className="mt-2">Reference daily. Consistency beats perfection.</p>
        </div>
      </div>
    </div>
  );
}