/**
 * generator.js
 * Calls Claude API and returns a structured weekly tech brief.
 */

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = () => `You are a personal Tech Research & Implementation Strategist.

DEVELOPER PROFILE:
- Level: ${process.env.DEV_LEVEL || 'intermediate'}
- Stack: ${process.env.DEV_STACK || 'TypeScript, Python, fullstack'}
- Focus: ${process.env.DEV_FOCUS || 'AI/ML, DevOps, Frontend, Backend'}
- Wants production-ready or near-production tools
- Has a full weekend (Sat + Sun) to learn and build
${process.env.DEV_CONTEXT ? `- Context: ${process.env.DEV_CONTEXT}` : ''}
${process.env.PROD_READY_ONLY === 'true' ? '- Strongly prefers production-ready tools only' : ''}

RETURN ONLY raw JSON. No markdown, no backticks, no explanations. Follow this exact schema:

{
  "weekOf": "Week of [Month Day], [Year]",
  "totalHours": 32,
  "picks": [
    {
      "id": 1,
      "name": "Technology Name",
      "tagline": "One-line punchy description",
      "domain": "AI | Backend | Frontend | DevOps | Security | Data",
      "whyNow": "2-3 sentences on market relevance and traction right now",
      "useCases": [
        "Concrete real-world use case 1",
        "Concrete real-world use case 2",
        "Concrete real-world use case 3"
      ],
      "resource": {
        "label": "Official Docs / Best Tutorial Title",
        "url": "https://actual-url.com"
      },
      "priorityScore": 9,
      "priorityBreakdown": {
        "industryDemand": 9,
        "longTermRelevance": 9,
        "practicalROI": 9
      },
      "plan": {
        "friday": {
          "duration": "30 min",
          "read": "Specific article or doc section to read",
          "install": "npm install X / pip install X / brew install X"
        },
        "saturday": {
          "duration": "4 hours",
          "concepts": ["Core concept 1", "Core concept 2", "Core concept 3"],
          "tutorial": "Specific tutorial to follow step by step",
          "experiment": "Concrete hands-on experiment to run"
        },
        "sunday": {
          "duration": "4 hours",
          "project": "MicroProject Name",
          "steps": [
            "Step 1: scaffold X with Y command",
            "Step 2: implement Z feature",
            "Step 3: wire up A to B",
            "Step 4: test and deploy/run"
          ],
          "stretchGoal": "Optional advanced enhancement"
        }
      },
      "outcome": "Precise description of what you will have shipped by Sunday night",
      "timeEstimate": {
        "friday": 0.5,
        "saturday": 4,
        "sunday": 4,
        "total": 8.5
      }
    }
  ]
}

RULES:
- Exactly ${process.env.PICKS_COUNT || 4} picks
- Vary domains — don't stack multiple AI picks
- Avoid hype: pick tools with real GitHub stars, job postings, production adoption
- Resource URLs must be real and specific (official docs or reputable blogs)
- Install commands must be real, copy-paste ready terminal commands
- Sunday projects must be buildable in 4–5 hours by a solo developer
- Return ONLY valid JSON`;

const USER_PROMPT = () => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  return `Today is ${today}. Generate this week's tech research brief. Make it fresh, varied across domains (AI, infra, frontend, backend, security, data), and grounded in what is actually gaining traction in the developer community right now in early 2026.`;
};

export async function generateBrief() {
  const tools = [{ type: 'web_search_20250305', name: 'web_search' }];

  const response = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: SYSTEM_PROMPT(),
    messages: [{ role: 'user', content: USER_PROMPT() }],
    tools
  });

  // Extract text blocks only (ignore tool_use blocks)
  const text = response.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('');

  // Parse JSON — strip any accidental markdown fences
  const clean = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  const start = clean.indexOf('{');
  const end   = clean.lastIndexOf('}');
  if (start === -1 || end === -1) {
    throw new Error('No valid JSON found in Claude response. Raw:\n' + text.slice(0, 500));
  }

  const brief = JSON.parse(clean.slice(start, end + 1));

  if (!brief.picks || !Array.isArray(brief.picks) || brief.picks.length === 0) {
    throw new Error('Invalid brief structure — picks array is missing or empty');
  }

  // Attach metadata
  brief.generatedAt = new Date().toISOString();
  brief.totalHours  = brief.picks.reduce(
    (sum, p) => sum + (p.timeEstimate?.total || 8.5), 0
  );

  return brief;
}
