const express = require("express");
const rateLimit = require("express-rate-limit");
const { sendMail } = require("../services/mailer");

const router = express.Router();

const clean = (v = "") => String(v).trim().slice(0, 5000);

// Rate limiter (20 per hour per IP)
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/contact
router.post("/contact", limiter, async (req, res) => {
  try {
    const {
      formType = "general",
      name = "",
      email = "",
      message = "",
      company = "", // honeypot
      ts = "",
    } = req.body;

    // Honeypot
    if (company) {
      return res.status(400).json({ ok: false, error: "spam-detected" });
    }

    // Timestamp check
    const now = Date.now();
    const submittedAt = Number(ts) || now;
    if (now - submittedAt < 2000) {
      return res.status(400).json({ ok: false, error: "too-fast" });
    }

    // Required fields
    if (!clean(name) || !clean(email)) {
      return res.status(400).json({ ok: false, error: "missing-fields" });
    }

    // Build email body
    const lines = [];
    for (const [key, val] of Object.entries(req.body)) {
      if (["company"].includes(key)) continue;
      lines.push(`${key}: ${clean(val)}`);
    }
    const textBody = lines.join("\n");

    // Send email
    const info = await sendMail({
      formType,
      name: clean(name),
      email: clean(email),
      body: textBody,
    });

    return res.json({ ok: true, id: info.messageId || null });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "server-error" });
  }
});

module.exports = router;
