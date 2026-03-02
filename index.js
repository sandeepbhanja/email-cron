/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║           TECH STRATEGIST — Weekly Email + Calendar          ║
 * ║  Generates your weekly tech brief, emails it, and drops      ║
 * ║  a .ics calendar invite for the upcoming learning weekend.   ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

import 'dotenv/config';
import cron from 'node-cron';
import { generateBrief } from './src/generator.js';
import { sendBriefEmail } from './src/mailer.js';
import { createCalendarEvent } from './src/calendar.js';
import { log } from './src/logger.js';

const isTest = process.argv.includes('--test');
const isDirect = process.argv.includes('--send') || isTest;
const schedule = process.env.CRON_SCHEDULE || '0 8 * * 1'; // Mon 8am

// ─── Run once immediately (--send or --test flag) ───────────────
if (isDirect) {
  console.error('Running in direct mode...');
  await run(isTest);
  process.exit(0);
}

// ─── Cron mode ──────────────────────────────────────────────────
console.log(`Tech Strategist Mailer started.`);
console.log(`Scheduled: "${schedule}" (${process.env.TIMEZONE || 'system timezone'})`);
console.log('Waiting for next scheduled run. Use --send to trigger immediately.\n');

cron.schedule(schedule, () => run(false), {
  timezone: process.env.TIMEZONE || 'Asia/Kolkata'
});

// ─── Core runner ────────────────────────────────────────────────
async function run(testMode = false) {
  const startTime = Date.now();
  log.section('TECH STRATEGIST WEEKLY BRIEF');
  console.log(testMode ? 'TEST MODE — no real email sent' : 'LIVE MODE — email will be sent');

  try {
    // 1. Generate brief via Claude
    log.step(1, 'Generating brief via Claude API...');
    const brief = await generateBrief();
    log.success(`Generated ${brief.picks.length} tech picks for "${brief.weekOf}"`);

    // 2. Create .ics calendar file
    log.step(2, 'Creating calendar event...');
    const icsContent = createCalendarEvent(brief);
    log.success('Calendar event created (Sat–Sun learning weekend)');

    // 3. Send email
    log.step(3, testMode ? 'Skipping email (test mode)...' : 'Sending email...');
    if (!testMode) {
      const result = await sendBriefEmail(brief, icsContent);
      log.success(`Email sent to: ${result.accepted.join(', ')}`);
    } else {
      console.log('Email would be sent to: ' + process.env.EMAIL_TO);
      console.log('Brief preview:');
      brief.picks.forEach((p, i) => {
        console.log(`  ${i + 1}. ${p.name} (${p.priorityScore}/10) — ${p.domain}`);
      });
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    log.section(`DONE in ${elapsed}s`);

  } catch (err) {
    log.error('Failed:', err.message);
    if (err.stack) log.error(err.stack);
    process.exit(1);
  }
}
