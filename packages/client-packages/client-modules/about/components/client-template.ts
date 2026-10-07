export const clientTemplate = (formData: { name: string; subject: string }) => `
<div style="background-color: #f9f9f9; padding: 40px 20px; font-family: 'Times New Roman', Times, serif;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; padding: 50px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="font-size: 28px; letter-spacing: 4px; text-transform: uppercase; color: #1a1a1a; margin: 0;">Needlon</h1>
      <p style="font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #999; margin-top: 5px;">Bespoke Tailoring & Essentials</p>
    </div>

    <div style="text-align: center; margin-bottom: 40px; padding: 20px; border-top: 1px solid #eee; border-bottom: 1px solid #eee;">
      <p style="font-style: italic; color: #443f38; font-size: 18px; line-height: 1.6;">
        "Style is a way to say who you are without having to speak."
      </p>
      <p style="font-size: 12px; text-transform: uppercase; color: #b5a48b; margin-top: 10px;">— Rachel Zoe</p>
    </div>

    <div style="color: #333; line-height: 1.8; font-family: Arial, sans-serif; font-size: 15px;">
      <p>Dear ${formData.name},</p>
      <p>Thank you for reaching out to the Needlon Atelier. We have received your inquiry regarding <strong>"${formData.subject}"</strong>.</p>
      <p>Our commitment to precision extends beyond our garments to our service. One of our master consultants is currently reviewing your message and will provide a personal response within 24 to 48 hours.</p>
      <p>In the meantime, we invite you to explore our latest seasonal collection.</p>
    </div>

    <div style="text-align: center; margin-top: 40px;">
      <a href="${process.env.NEXT_PUBLIC_URL}/shop" style="background-color: #443f38; color: #ffffff; padding: 15px 30px; text-decoration: none; font-size: 13px; font-weight: bold; letter-spacing: 1px;">VIEW COLLECTION</a>
    </div>

    <div style="text-align: center; margin-top: 50px; color: #999; font-size: 11px;">
      <p>&copy; 2026 Needlon Atelier. All Rights Reserved.</p>
    </div>
  </div>
</div>
`;
