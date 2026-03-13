import 'dotenv/config';
import { generateBrief } from '../src/generator.js';
import { sendBriefEmail } from '../src/mailer.js';
import { createCalendarEvent } from '../src/calendar.js';
import { log } from '../src/logger.js';

export default async function handler(req, res) {
    // Verify cron secret
    if (req.headers['x-vercel-cron-secret'] !== process.env.CRON_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const brief = await generateBrief();
        const icsContent = createCalendarEvent(brief);
        const result = await sendBriefEmail(brief, icsContent);

        res.status(200).json({ success: true, email: result.accepted });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}