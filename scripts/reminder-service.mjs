import nodemailer from 'nodemailer';
import cron from 'node-cron';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(process.cwd(), 'data', 'subscribers.json');

// 1. Setup the Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Helper to get IST Today YYYY-MM-DD
 */
const getISTTodayString = () => {
    const d = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric', month: '2-digit', day: '2-digit'
    });
    const parts = formatter.formatToParts(d);
    const year = parts.find(p => p.type === 'year')?.value;
    const month = parts.find(p => p.type === 'month')?.value;
    const day = parts.find(p => p.type === 'day')?.value;
    return `${year}-${month}-${day}`;
};

/**
 * Main reminder function
 */
async function checkReminders() {
    console.log(`[${new Date().toISOString()}] Checking for vehicle service reminders...`);
    
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        const subscribers = JSON.parse(data);
        const today = getISTTodayString();
        
        console.log(`Today (IST): ${today}. Found ${subscribers.length} total subscriptions.`);

        for (const user of subscribers) {
            // Check if reminder is due today
            if (user.nextServiceDate === today && !user.reminderSent) {
                console.log(`Match found for ${user.email}! Sending email...`);
                await sendReminder(user.email);
                user.reminderSent = true;
            }
        }

        // Save updated state (to avoid double sending if script restarts same day)
        await fs.writeFile(DATA_FILE, JSON.stringify(subscribers, null, 2));

    } catch (err) {
        console.error("Error checking reminders:", err);
    }
}

/**
 * Send email via Nodemailer
 */
async function sendReminder(email) {
    const mailOptions = {
        from: '"Emission-Sense Reminder" <no-reply@emmissionsense.com>',
        to: email,
        subject: '🚗 Your Ride is Due for Service!',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #2e7d32;">Emission-Sense Service Alert</h2>
                <p>Hey there! Your friendly <strong>Emission-Sense</strong> buddy here.</p>
                <p>I noticed your vehicle's service or PUC is due today. Keeping your car well-maintained is the easiest way to lower emissions and save fuel!</p>
                <div style="background: #f1f8e9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0;"><strong>Action Required:</strong> Please schedule your vehicle checkup soon.</p>
                </div>
                <p>Let's keep those emissions low and the air clean! 🌍</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #888;">You received this because you subscribed to reminders on Emission-Sense.</p>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${email}: ${info.messageId}`);
    } catch (err) {
        console.error(`❌ Mail Error for ${email}:`, err);
        throw err;
    }
}

// 2. THE CRON JOB: Runs every day at 9:00 AM IST
// Cron syntax: 'minute hour day-of-month month day-of-week'
// To run every day at 9:00 AM: '0 9 * * *'
cron.schedule('0 9 * * *', () => {
    checkReminders();
}, {
    timezone: "Asia/Kolkata"
});

console.log("🚀 Emission-Sense Reminder Service started!");
console.log("Cron scheduled: Daily at 9:00 AM IST.");

// Initial check on startup (for demo/active dev)
checkReminders();
