import express from "express";
import cors from "cors";
import { Resend } from "resend";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ initialize resend with your API key (set in Render)
const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ API route for booking form
app.post("/book", async (req, res) => {
  try {
    const booking = req.body;
    console.log("New Booking Received:", booking);

    // Message for owner (you)
    const ownerMessage = `
New Generator Booking Received

Model: ${booking.model}
Date: ${booking.date}
Time: ${booking.time}
Name: ${booking.name}
Phone: ${booking.phone}
Email: ${booking.email}
Location: ${booking.location}
Quantity: ${booking.qty}
Message: ${booking.message || "N/A"}

— Vijay Generator Booking System
    `;

    // Send email to business owner
    await resend.emails.send({
      from: "Vijay Generator <onboarding@resend.dev>",
      to: "your_email@gmail.com", // 🔹 change this to YOUR email
      subject: "New Booking Received – Vijay Generator",
      text: ownerMessage,
    });

    // Message for customer
    const customerMessage = `
Dear ${booking.name},

Thank you for booking a generator with Vijay Generator!
Here are your booking details:

Model: ${booking.model}
Date: ${booking.date}
Time: ${booking.time}
Location: ${booking.location}
Quantity: ${booking.qty}

Our team will contact you shortly for confirmation.

Best regards,  
Vijay Generator
📞 Customer Support
    `;

    // Send confirmation email to the customer
    await resend.emails.send({
      from: "Vijay Generator <onboarding@resend.dev>",
      to: booking.email,
      subject: "Booking Confirmation – Vijay Generator",
      text: customerMessage,
    });

    res.status(200).send("Booking confirmed and emails sent!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to process booking.");
  }
});

// ✅ Basic route for testing
app.get("/", (req, res) => {
  res.send("✅ Vijay Generator Booking Server is running!");
});

// ✅ Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
