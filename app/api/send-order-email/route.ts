import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { order, items } = await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const itemsHtml = items.map((item: any) => `
      <div style="border-bottom: 1px solid #e5e7eb; padding: 10px 0;">
        <p style="margin: 0; font-weight: bold; color: #111827;">${item.name}</p>
        <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">Quantité : ${item.quantity} × ${item.price} TND</p>
      </div>
    `).join('');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `📦 Nouvelle Commande - ${order.order_number}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-bottom: 20px;">Nouvelle Commande Reçue !</h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
            <p style="margin: 0 0 10px 0;"><strong>Numéro :</strong> <span style="color: #2563eb;">${order.order_number}</span></p>
            <p style="margin: 0 0 10px 0;"><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
          </div>

          <h3 style="color: #1e293b; margin-bottom: 12px; font-size: 16px; text-transform: uppercase; letter-spacing: 0.05em;">Produits commandés :</h3>
          <div style="margin-bottom: 24px;">
            ${itemsHtml}
            <div style="margin-top: 15px; text-align: right;">
              <p style="font-size: 20px; color: #2563eb; font-weight: bold; margin: 0;">Total : ${order.total_price} TND</p>
            </div>
          </div>

          <h3 style="color: #1e293b; margin-bottom: 12px; font-size: 16px; text-transform: uppercase; letter-spacing: 0.05em;">Détails du Client :</h3>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px;">
            <p style="margin: 0 0 8px 0;"><strong>Nom :</strong> ${order.customer_name}</p>
            <p style="margin: 0 0 8px 0;"><strong>Téléphone :</strong> <a href="tel:${order.customer_phone}" style="color: #2563eb; text-decoration: none; font-weight: bold;">${order.customer_phone}</a></p>
            <p style="margin: 0;"><strong>Adresse :</strong> ${order.customer_address}</p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 11px; text-align: center;">
            <p>Cet email a été généré automatiquement par le système de commande Kraftory.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return Response.json({ success: true, message: "Email sent" });
  } catch (error) {
    console.error("Email error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}