/**
 * mailer.js
 * Sends the weekly brief email with the .ics calendar attachment
 * using Nodemailer (supports Gmail, Outlook, any SMTP server).
 */

import nodemailer from 'nodemailer';
import { buildEmailHTML, buildEmailText } from './emailTemplate.js';

function createTransport() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error(
      'Missing SMTP credentials.\n' +
      'Set SMTP_USER and SMTP_PASS in your .env file.\n' +
      'For Gmail, generate an App Password at:\n' +
      'https://myaccount.google.com/apppasswords'
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false }
  });
}

export async function sendBriefEmail(brief, icsContent) {
  const transport = createTransport();

  const to = process.env.EMAIL_TO || process.env.SMTP_USER;
  const from = `"⚡ Tech Strategist" <${process.env.SMTP_USER}>`;

  const today = new Date(brief.generatedAt || Date.now());
  const dateLabel = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const subject = `⚡ Tech Brief — ${brief.weekOf} · ${brief.picks.length} Picks, ${Math.round(brief.totalHours)}h`;

  const mailOptions = {
    from,
    to,
    subject,
    text: buildEmailText(brief),
    html: buildEmailHTML(brief),
    attachments: [
      {
        filename: `tech-brief-${dateLabel.replace(/[\s,]/g, '-').toLowerCase()}.ics`,
        content: icsContent,
        contentType: 'text/calendar; charset=utf-8; method=PUBLISH',
        contentDisposition: 'attachment'
      }
    ]
  };

  // Verify connection before sending
  await transport.verify();
  const info = await transport.sendMail(mailOptions);
  return info;
}
