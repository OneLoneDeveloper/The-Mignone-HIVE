// server.js (or routes/contact.js)
import express from 'express';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';

const app = express();

// Parse both urlencoded and JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Basic rate limiter (per IP)
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,                  // 20 submissions/hour
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/contact', limiter);

// Mail transport (configure your SMTP)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,          // e.g. "smtp.gmail.com"
  port: Number(process.env.SMTP_PORT),  // e.g. 587
  secure: false,                        // true if port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Helper: sanitize/normalize fields minimally
const clean = (v = '') => String(v).trim().slice(0, 5000);

app.post('/api/contact', async (req, res) => {
  try {
    const {
      formType = 'general',
      name = '',
      email = '',
      message = '',
      company = '', // honeypot
      ts = ''
      // ...any other fields are allowed and will be forwarded
    } = req.body;

    // Honeypot: if filled => bot
    if (company) {
      return res.status(400).json({ ok: false, error: 'spam-detected' });
    }

    // Time trap: quick submits look botty
    const now = Date.now();
    const submittedAt = Number(ts) || now;
    if (now - submittedAt < 2000) {
      return res.status(400).json({ ok: false, error: 'too-fast' });
    }

    // Required fields
    if (!clean(name) || !clean(email)) {
      return res.status(400).json({ ok: false, error: 'missing-fields' });
    }

    // Build a summary of all submitted fields
    const lines = [];
    for (const [key, val] of Object.entries(req.body)) {
      if (['company'].includes(key)) continue; // skip honeypot in email
      lines.push(`${key}: ${clean(val)}`);
    }
    const textBody = lines.join('\n');

    // Send email
    const info = await transporter.sendMail({
      from: `"Website Contact" <${process.env.SMTP_USER}>`,
      to: process.env.TO_EMAIL, // where you receive submissions
      replyTo: clean(email),
      subject: `[${formType}] New submission from ${clean(name)}`,
      text: textBody,
      html: `<pre style="font: 14px/1.4 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif">${textBody}</pre>`
    });

    // Optionally: log info.messageId, store in DB, etc.
    return res.json({ ok: true, id: info.messageId || null });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: 'server-error' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
