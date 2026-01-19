import express from "express";
import cors from "cors";
import { Resend } from "resend";

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.get("/", (req, res) => {
  res.send("✅ Vijay Generator Server is running...");
});

app.post("/book", async (req, res) => {
  const data = req.body;

  // 🔹 basic validation
  if (!data.name || !data.model || !data.phone || !data.date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // ✅ 1. TURANT RESPONSE (IMPORTANT)
  res.json({ success: true });

  // ✅ 2. EMAIL BACKGROUND ME (NON-BLOCKING)
  resend.emails.send({
    from: "Vijay Generator <onboarding@resend.dev>",
    to: "teetram08@gmail.com", // change if needed
    subject: `New Booking - ${data.model}`,
    html: `
      <h2>New Generator Booking</h2>
      <p><b>Name:</b> ${data.name}</p>
      <p><b>Phone:</b> ${data.phone}</p>
      <p><b>Email:</b> ${data.email || "-"}</p>
      <p><b>Model:</b> ${data.model}</p>
      <p><b>Date:</b> ${data.date}</p>
      <p><b>Time:</b> ${data.time || "-"}</p>
      <p><b>Location:</b> ${data.location || "-"}</p>
      <p><b>Quantity:</b> ${data.qty || "1"}</p>
      <p><b>Message:</b> ${data.message || "-"}</p>
    `,
  })
  .then(() => {
    console.log("✅ Email sent successfully");
  })
  .catch((err) => {
    console.error("❌ Email error:", err.message);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);