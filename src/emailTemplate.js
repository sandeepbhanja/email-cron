/**
 * emailTemplate.js
 * Generates a rich HTML email for the weekly tech brief.
 * Designed to render beautifully in Gmail, Apple Mail, and Outlook.
 * Uses table-based layout (email safe) with inline styles.
 */

function scoreColor(s) {
  if (s >= 9) return '#b8f400';
  if (s >= 7) return '#00d4ff';
  if (s >= 5) return '#ff6b35';
  return '#ff4757';
}

function scoreBg(s) {
  if (s >= 9) return 'rgba(184,244,0,0.12)';
  if (s >= 7) return 'rgba(0,212,255,0.12)';
  if (s >= 5) return 'rgba(255,107,53,0.12)';
  return 'rgba(255,71,87,0.12)';
}

function domainEmoji(domain) {
  const map = {
    'AI': '🤖', 'Backend': '⚙️', 'Frontend': '🎨',
    'DevOps': '🚀', 'Security': '🔒', 'Data': '📊',
    'Mobile': '📱', 'Infrastructure': '🏗'
  };
  return map[domain] || '⚡';
}

function scoreBar(label, value, color) {
  const pct = value * 10;
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
      <tr>
        <td style="font-family:'Courier New',monospace;font-size:10px;color:#888;letter-spacing:1px;padding-bottom:4px;text-transform:uppercase;">${label}</td>
        <td align="right" style="font-family:'Courier New',monospace;font-size:11px;color:${color};font-weight:bold;padding-bottom:4px;">${value}/10</td>
      </tr>
      <tr>
        <td colspan="2">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="background:#1e2030;border-radius:3px;height:3px;overflow:hidden;">
                <table cellpadding="0" cellspacing="0" width="${pct}%">
                  <tr><td style="background:${color};height:3px;border-radius:3px;">&nbsp;</td></tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
}

function pickCard(pick, index) {
  const sc = scoreColor(pick.priorityScore);
  const sb = scoreBg(pick.priorityScore);
  const emoji = domainEmoji(pick.domain);
  const total = pick.timeEstimate?.total || 8.5;

  const useCases = (pick.useCases || []).map(u => `
    <tr>
      <td style="padding:0 0 8px 0;">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td width="16" valign="top" style="padding-top:1px;color:${sc};font-size:13px;">›</td>
            <td style="font-family:Georgia,serif;font-size:13px;color:#b0b4c8;line-height:1.6;font-weight:300;">${u}</td>
          </tr>
        </table>
      </td>
    </tr>`).join('');

  const steps = (pick.plan?.sunday?.steps || []).map((s, i) => `
    <tr>
      <td style="padding:0 0 8px 0;">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td width="24" valign="top">
              <div style="background:rgba(184,244,0,0.15);color:${sc};border-radius:4px;width:18px;height:18px;text-align:center;font-family:'Courier New',monospace;font-size:9px;font-weight:bold;line-height:18px;margin-top:1px;">${i+1}</div>
            </td>
            <td style="font-family:Georgia,serif;font-size:12px;color:#b0b4c8;line-height:1.6;font-weight:300;">${s}</td>
          </tr>
        </table>
      </td>
    </tr>`).join('');

  const concepts = (pick.plan?.saturday?.concepts || []).map(c =>
    `<span style="display:inline-block;background:rgba(0,212,255,0.12);border:1px solid rgba(0,212,255,0.2);color:#00d4ff;padding:2px 8px;border-radius:4px;font-family:'Courier New',monospace;font-size:10px;margin:2px;">${c}</span>`
  ).join('');

  return `
  <!-- ── PICK CARD ${index + 1} ── -->
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;background:#0e1018;border:1px solid #1e2236;border-radius:16px;overflow:hidden;">

    <!-- Card Header -->
    <tr>
      <td style="padding:24px 28px;border-bottom:1px solid #1a1e2e;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <!-- Number + Name row -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="display:inline-block;background:${sb};color:${sc};border-radius:10px;width:40px;height:40px;text-align:center;line-height:40px;font-family:Arial Black,sans-serif;font-size:16px;font-weight:900;margin-right:14px;float:left;">0${index+1}</div>
                  </td>
                  <td style="padding-left:14px;">
                    <div style="font-family:Arial Black,sans-serif;font-size:20px;font-weight:900;color:#f0f2ff;letter-spacing:-0.5px;margin-bottom:4px;">${pick.name}</div>
                    <div style="font-family:Georgia,serif;font-size:13px;color:#888;font-style:italic;">${pick.tagline}</div>
                  </td>
                </tr>
              </table>
            </td>
            <td align="right" valign="top" width="120">
              <!-- Score badge -->
              <div style="display:inline-block;background:${sb};color:${sc};border:1px solid ${sc}33;border-radius:8px;padding:6px 14px;font-family:'Courier New',monospace;font-size:15px;font-weight:bold;margin-bottom:6px;">${pick.priorityScore}/10</div>
              <br/>
              <!-- Domain badge -->
              <div style="display:inline-block;background:#1a1e2e;color:#888;border-radius:6px;padding:3px 10px;font-family:'Courier New',monospace;font-size:10px;">${emoji} ${pick.domain || 'Tech'}</div>
              <br/>
              <!-- Time -->
              <div style="font-family:'Courier New',monospace;font-size:10px;color:#555;margin-top:6px;">~${total}h weekend</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Why Now -->
    <tr>
      <td style="padding:20px 28px;border-bottom:1px solid #1a1e2e;">
        <div style="font-family:'Courier New',monospace;font-size:9px;letter-spacing:2px;color:#555;text-transform:uppercase;margin-bottom:10px;">WHY NOW</div>
        <div style="font-family:Georgia,serif;font-size:14px;color:#c0c4d8;line-height:1.75;font-weight:300;border-left:2px solid ${sc};padding-left:16px;">${pick.whyNow}</div>
      </td>
    </tr>

    <!-- Use Cases + Priority Scores (2-col) -->
    <tr>
      <td style="padding:20px 28px;border-bottom:1px solid #1a1e2e;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="50%" valign="top" style="padding-right:16px;">
              <div style="font-family:'Courier New',monospace;font-size:9px;letter-spacing:2px;color:#555;text-transform:uppercase;margin-bottom:12px;">USE CASES</div>
              <table width="100%" cellpadding="0" cellspacing="0">${useCases}</table>
            </td>
            <td width="50%" valign="top" style="padding-left:16px;">
              <div style="font-family:'Courier New',monospace;font-size:9px;letter-spacing:2px;color:#555;text-transform:uppercase;margin-bottom:12px;">PRIORITY BREAKDOWN</div>
              ${scoreBar('Industry Demand', pick.priorityBreakdown?.industryDemand || pick.priorityScore, sc)}
              ${scoreBar('Long-term Relevance', pick.priorityBreakdown?.longTermRelevance || pick.priorityScore, sc)}
              ${scoreBar('Practical ROI', pick.priorityBreakdown?.practicalROI || pick.priorityScore, sc)}
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Weekend Plan Header -->
    <tr>
      <td style="padding:20px 28px 12px;">
        <div style="font-family:'Courier New',monospace;font-size:9px;letter-spacing:2px;color:#555;text-transform:uppercase;">WEEKEND LEARNING PLAN</div>
      </td>
    </tr>

    <!-- Friday -->
    <tr>
      <td style="padding:0 28px 12px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#0c0f1a;border:1px solid #1a1e2e;border-top:2px solid #ff6b35;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:16px 20px;">
              <div style="font-family:'Courier New',monospace;font-size:10px;font-weight:bold;color:#ff6b35;letter-spacing:1.5px;margin-bottom:12px;">⏰ FRIDAY NIGHT · 30 MIN</div>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" valign="top" style="padding-right:12px;">
                    <div style="font-family:'Courier New',monospace;font-size:9px;color:#555;letter-spacing:1px;margin-bottom:6px;">📖 READ</div>
                    <div style="font-family:Georgia,serif;font-size:12px;color:#b0b4c8;line-height:1.6;font-weight:300;">${pick.plan?.friday?.read || '—'}</div>
                  </td>
                  <td width="50%" valign="top" style="padding-left:12px;">
                    <div style="font-family:'Courier New',monospace;font-size:9px;color:#555;letter-spacing:1px;margin-bottom:6px;">⚙️ INSTALL</div>
                    <div style="font-family:'Courier New',monospace;font-size:11px;color:#b8f400;background:#000;border-radius:6px;padding:8px 10px;line-height:1.6;">${pick.plan?.friday?.install || '—'}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Saturday -->
    <tr>
      <td style="padding:0 28px 12px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#0c0f1a;border:1px solid #1a1e2e;border-top:2px solid #00d4ff;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:16px 20px;">
              <div style="font-family:'Courier New',monospace;font-size:10px;font-weight:bold;color:#00d4ff;letter-spacing:1.5px;margin-bottom:12px;">🧠 SATURDAY · DEEP LEARNING</div>
              <div style="margin-bottom:12px;">
                <div style="font-family:'Courier New',monospace;font-size:9px;color:#555;letter-spacing:1px;margin-bottom:8px;">CONCEPTS</div>
                <div>${concepts}</div>
              </div>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" valign="top" style="padding-right:12px;">
                    <div style="font-family:'Courier New',monospace;font-size:9px;color:#555;letter-spacing:1px;margin-bottom:6px;">📚 TUTORIAL</div>
                    <div style="font-family:Georgia,serif;font-size:12px;color:#b0b4c8;line-height:1.6;font-weight:300;">${pick.plan?.saturday?.tutorial || '—'}</div>
                  </td>
                  <td width="50%" valign="top" style="padding-left:12px;">
                    <div style="font-family:'Courier New',monospace;font-size:9px;color:#555;letter-spacing:1px;margin-bottom:6px;">🔬 EXPERIMENT</div>
                    <div style="font-family:Georgia,serif;font-size:12px;color:#b0b4c8;line-height:1.6;font-weight:300;">${pick.plan?.saturday?.experiment || '—'}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Sunday -->
    <tr>
      <td style="padding:0 28px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#0c0f1a;border:1px solid #1a1e2e;border-top:2px solid ${sc};border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:16px 20px;">
              <div style="font-family:'Courier New',monospace;font-size:10px;font-weight:bold;color:${sc};letter-spacing:1.5px;margin-bottom:4px;">🏗 SUNDAY · BUILD & SHIP</div>
              <div style="font-family:Arial Black,sans-serif;font-size:14px;color:#f0f2ff;margin-bottom:14px;font-weight:900;">${pick.plan?.sunday?.project || 'Weekend Project'}</div>
              <table width="100%" cellpadding="0" cellspacing="0">${steps}</table>
              ${pick.plan?.sunday?.stretchGoal ? `
              <div style="background:rgba(185,124,255,0.08);border:1px solid rgba(185,124,255,0.2);border-radius:8px;padding:10px 14px;margin-top:10px;">
                <div style="font-family:'Courier New',monospace;font-size:9px;color:#b97cff;letter-spacing:1px;margin-bottom:4px;">⚡ STRETCH GOAL</div>
                <div style="font-family:Georgia,serif;font-size:12px;color:#b0b4c8;font-weight:300;">${pick.plan.sunday.stretchGoal}</div>
              </div>` : ''}
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Outcome + Time + Resource -->
    <tr>
      <td style="padding:0 28px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <!-- Outcome -->
            <td valign="top" style="padding-right:10px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(184,244,0,0.05);border:1px solid rgba(184,244,0,0.15);border-radius:12px;">
                <tr>
                  <td style="padding:14px 16px;">
                    <div style="font-family:'Courier New',monospace;font-size:9px;color:${sc};letter-spacing:1.5px;margin-bottom:8px;">🏁 BY SUNDAY NIGHT YOU'LL HAVE</div>
                    <div style="font-family:Georgia,serif;font-size:13px;color:#e0e4f8;line-height:1.6;font-weight:300;">${pick.outcome}</div>
                  </td>
                </tr>
              </table>
            </td>
            <!-- Time -->
            <td width="130" valign="top" style="padding:0 10px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0c0f1a;border:1px solid #1a1e2e;border-radius:12px;">
                <tr>
                  <td style="padding:14px 12px;">
                    <div style="font-family:'Courier New',monospace;font-size:9px;color:#555;letter-spacing:1px;margin-bottom:10px;text-align:center;">⏱ HOURS</div>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <div style="font-family:Arial Black,sans-serif;font-size:18px;font-weight:900;color:#ff6b35;">${pick.timeEstimate?.friday || 0.5}h</div>
                          <div style="font-family:'Courier New',monospace;font-size:9px;color:#555;">Fri</div>
                        </td>
                        <td align="center" style="border-left:1px solid #1a1e2e;">
                          <div style="font-family:Arial Black,sans-serif;font-size:18px;font-weight:900;color:#00d4ff;">${pick.timeEstimate?.saturday || 4}h</div>
                          <div style="font-family:'Courier New',monospace;font-size:9px;color:#555;">Sat</div>
                        </td>
                        <td align="center" style="border-left:1px solid #1a1e2e;">
                          <div style="font-family:Arial Black,sans-serif;font-size:18px;font-weight:900;color:${sc};">${pick.timeEstimate?.sunday || 4}h</div>
                          <div style="font-family:'Courier New',monospace;font-size:9px;color:#555;">Sun</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
            <!-- Resource -->
            <td width="160" valign="top" style="padding-left:10px;">
              ${pick.resource ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(0,212,255,0.05);border:1px solid rgba(0,212,255,0.2);border-radius:12px;">
                <tr>
                  <td style="padding:14px 14px;">
                    <div style="font-family:'Courier New',monospace;font-size:9px;color:#00d4ff;letter-spacing:1px;margin-bottom:8px;">📎 BEST RESOURCE</div>
                    <a href="${pick.resource.url}" style="font-family:Georgia,serif;font-size:12px;color:#00d4ff;text-decoration:none;line-height:1.5;">${pick.resource.label} ↗</a>
                  </td>
                </tr>
              </table>` : ''}
            </td>
          </tr>
        </table>
      </td>
    </tr>

  </table>`;
}

export function buildEmailHTML(brief) {
  const today = new Date(brief.generatedAt || Date.now());
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const totalHours = Math.round(brief.totalHours || 0);
  const avgScore = (
    brief.picks.reduce((a, p) => a + (p.priorityScore || 0), 0) / brief.picks.length
  ).toFixed(1);

  const picksHTML = brief.picks.map((p, i) => pickCard(p, i)).join('\n');

  // Quick summary table at top
  const summaryRow = brief.picks.map(p => `
    <td align="center" style="padding:0 8px;">
      <div style="background:${scoreBg(p.priorityScore)};color:${scoreColor(p.priorityScore)};border-radius:8px;padding:8px 12px;font-family:'Courier New',monospace;font-size:10px;font-weight:bold;margin-bottom:4px;">${p.priorityScore}/10</div>
      <div style="font-family:Arial Black,sans-serif;font-size:11px;color:#f0f2ff;font-weight:900;margin-bottom:2px;">${p.name}</div>
      <div style="font-family:'Courier New',monospace;font-size:9px;color:#666;">${p.domain}</div>
    </td>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="color-scheme" content="dark"/>
<title>${brief.weekOf} — Tech Strategist</title>
</head>
<body style="margin:0;padding:0;background:#07080d;font-family:Georgia,serif;">

<!-- WRAPPER -->
<table width="100%" cellpadding="0" cellspacing="0" style="background:#07080d;padding:32px 16px;">
<tr><td align="center">

<!-- CONTAINER -->
<table width="700" cellpadding="0" cellspacing="0" style="max-width:700px;width:100%;">

  <!-- ── HEADER ── -->
  <tr>
    <td style="background:linear-gradient(135deg,#0c0f1a,#0e1020);border:1px solid #1e2236;border-radius:20px 20px 0 0;padding:36px 40px;border-bottom:none;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <!-- Logo -->
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#b8f400;border-radius:10px;width:36px;height:36px;text-align:center;line-height:36px;font-size:18px;vertical-align:middle;">⚡</td>
                <td style="padding-left:12px;vertical-align:middle;">
                  <div style="font-family:Arial Black,sans-serif;font-size:13px;font-weight:900;color:#f0f2ff;letter-spacing:1px;">TECH <span style="color:#b8f400;">STRATEGIST</span></div>
                  <div style="font-family:'Courier New',monospace;font-size:9px;color:#555;letter-spacing:2px;margin-top:1px;">WEEKLY RESEARCH BRIEF</div>
                </td>
              </tr>
            </table>
          </td>
          <td align="right" valign="middle">
            <div style="font-family:'Courier New',monospace;font-size:11px;color:#555;">${dateStr}</div>
          </td>
        </tr>
      </table>

      <!-- Big title -->
      <div style="margin-top:32px;">
        <div style="font-family:'Courier New',monospace;font-size:10px;color:#555;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Research Brief</div>
        <div style="font-family:Arial Black,sans-serif;font-size:32px;font-weight:900;color:#f0f2ff;letter-spacing:-1px;line-height:1;">${brief.weekOf}</div>
      </div>

      <!-- Stats row -->
      <table cellpadding="0" cellspacing="0" style="margin-top:24px;">
        <tr>
          <td style="background:#0a0c16;border:1px solid #1a1e2e;border-radius:10px;padding:12px 20px;text-align:center;margin-right:10px;">
            <div style="font-family:Arial Black,sans-serif;font-size:24px;font-weight:900;color:#b8f400;line-height:1;">${brief.picks.length}</div>
            <div style="font-family:'Courier New',monospace;font-size:9px;color:#555;letter-spacing:1px;margin-top:2px;">PICKS</div>
          </td>
          <td style="width:12px;"></td>
          <td style="background:#0a0c16;border:1px solid #1a1e2e;border-radius:10px;padding:12px 20px;text-align:center;">
            <div style="font-family:Arial Black,sans-serif;font-size:24px;font-weight:900;color:#00d4ff;line-height:1;">${totalHours}h</div>
            <div style="font-family:'Courier New',monospace;font-size:9px;color:#555;letter-spacing:1px;margin-top:2px;">LEARNING</div>
          </td>
          <td style="width:12px;"></td>
          <td style="background:#0a0c16;border:1px solid #1a1e2e;border-radius:10px;padding:12px 20px;text-align:center;">
            <div style="font-family:Arial Black,sans-serif;font-size:24px;font-weight:900;color:#00e87a;line-height:1;">${avgScore}</div>
            <div style="font-family:'Courier New',monospace;font-size:9px;color:#555;letter-spacing:1px;margin-top:2px;">AVG SCORE</div>
          </td>
          <td style="width:12px;"></td>
          <td style="background:#0a0c16;border:1px solid #1a1e2e;border-radius:10px;padding:12px 20px;text-align:center;">
            <div style="font-family:'Courier New',monospace;font-size:11px;color:#b8f400;font-weight:bold;">📅 .ics</div>
            <div style="font-family:'Courier New',monospace;font-size:9px;color:#555;letter-spacing:1px;margin-top:2px;">ATTACHED</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ── QUICK OVERVIEW ── -->
  <tr>
    <td style="background:#0a0c14;border-left:1px solid #1e2236;border-right:1px solid #1e2236;border-bottom:1px solid #1e2236;padding:20px 40px;">
      <div style="font-family:'Courier New',monospace;font-size:9px;color:#555;letter-spacing:2px;margin-bottom:16px;text-transform:uppercase;">This Week's Picks</div>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>${summaryRow}</tr>
      </table>
    </td>
  </tr>

  <!-- ── DIVIDER ── -->
  <tr>
    <td style="padding:8px 0;background:#07080d;"></td>
  </tr>

  <!-- ── PICK CARDS ── -->
  <tr>
    <td>
      ${picksHTML}
    </td>
  </tr>

  <!-- ── CALENDAR NOTICE ── -->
  <tr>
    <td style="background:#0a0c14;border:1px solid #1e2236;border-radius:16px;padding:24px 32px;margin-top:8px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td valign="top" width="48">
            <div style="background:rgba(0,212,255,0.1);border:1px solid rgba(0,212,255,0.2);border-radius:10px;width:40px;height:40px;text-align:center;line-height:40px;font-size:20px;">📅</div>
          </td>
          <td style="padding-left:16px;">
            <div style="font-family:Arial Black,sans-serif;font-size:14px;font-weight:900;color:#f0f2ff;margin-bottom:6px;">Calendar Events Attached</div>
            <div style="font-family:Georgia,serif;font-size:13px;color:#888;font-weight:300;line-height:1.6;">
              Two calendar events for this Saturday and Sunday (9am–9pm) are attached as a <strong style="color:#b0b4c8;">.ics file</strong>. Open the attachment to add them to Google Calendar, Apple Calendar, or Outlook with a single click.
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- SPACER -->
  <tr><td style="height:12px;"></td></tr>

  <!-- ── FOOTER ── -->
  <tr>
    <td style="padding:24px 0;text-align:center;border-top:1px solid #1a1e2e;">
      <div style="font-family:'Courier New',monospace;font-size:10px;color:#444;letter-spacing:1px;">Generated by Tech Strategist · Powered by Claude AI</div>
      <div style="font-family:'Courier New',monospace;font-size:10px;color:#333;margin-top:6px;">
        ${new Date(brief.generatedAt).toLocaleString('en-IN', { timeZone: process.env.TIMEZONE || 'Asia/Kolkata' })}
      </div>
    </td>
  </tr>

</table>
<!-- /CONTAINER -->

</td></tr>
</table>
<!-- /WRAPPER -->

</body>
</html>`;
}

export function buildEmailText(brief) {
  const lines = [
    `TECH STRATEGIST — ${brief.weekOf}`,
    '='.repeat(60),
    `Generated: ${new Date(brief.generatedAt).toLocaleString()}`,
    `Picks: ${brief.picks.length} | Total Hours: ~${Math.round(brief.totalHours)}h`,
    '',
    '━'.repeat(60),
    'THIS WEEK\'S PICKS',
    '━'.repeat(60),
    ''
  ];

  brief.picks.forEach((p, i) => {
    lines.push(`${i+1}. ${p.name}  [${p.priorityScore}/10]  ${p.domain}`);
    lines.push(`   ${p.tagline}`);
    lines.push('');
    lines.push(`   WHY NOW: ${p.whyNow}`);
    lines.push('');
    lines.push('   USE CASES:');
    (p.useCases || []).forEach(u => lines.push(`   • ${u}`));
    lines.push('');
    lines.push('   WEEKEND PLAN:');
    lines.push(`   ⏰ FRIDAY (30min)`);
    lines.push(`      Read:    ${p.plan?.friday?.read}`);
    lines.push(`      Install: ${p.plan?.friday?.install}`);
    lines.push(`   🧠 SATURDAY (4h)`);
    lines.push(`      Concepts: ${(p.plan?.saturday?.concepts || []).join(', ')}`);
    lines.push(`      Tutorial: ${p.plan?.saturday?.tutorial}`);
    lines.push(`   🏗  SUNDAY (4h)`);
    lines.push(`      Project:  ${p.plan?.sunday?.project}`);
    (p.plan?.sunday?.steps || []).forEach((s, j) => lines.push(`      ${j+1}. ${s}`));
    lines.push('');
    lines.push(`   🏁 OUTCOME: ${p.outcome}`);
    lines.push(`   📎 RESOURCE: ${p.resource?.label} — ${p.resource?.url}`);
    lines.push('');
    lines.push('─'.repeat(60));
    lines.push('');
  });

  lines.push('📅 Calendar .ics file is attached — import to add Sat+Sun blocks to your calendar.');
  lines.push('');
  lines.push('Tech Strategist · Powered by Claude AI');

  return lines.join('\n');
}
