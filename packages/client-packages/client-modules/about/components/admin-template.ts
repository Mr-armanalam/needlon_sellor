export const adminTemplate = (formData: { name: string; email: string; phone?: string; subject: string; message: string }) => `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; border: 1px solid #ddd; padding: 20px;">
  <div style="background-color: #443f38; color: #fff; padding: 15px; margin: -20px -20px 20px -20px;">
    <h2 style="margin: 0; font-size: 18px; text-transform: uppercase; letter-spacing: 1px;">New Website Inquiry</h2>
  </div>

  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 30%;">Client Name:</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${formData.name}</td>
    </tr>
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email Address:</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${formData.email}">${formData.email}</a></td>
    </tr>
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Phone Number:</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${formData?.phone || 'Not Provided'}</td>
    </tr>
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Subject:</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${formData.subject}</td>
    </tr>
  </table>

  <div style="margin-top: 20px; padding: 15px; background-color: #fcfcfc; border: 1px inset #eee;">
    <p style="font-weight: bold; margin-bottom: 10px;">Message Contents:</p>
    <p style="white-space: pre-wrap;">${formData.message}</p>
  </div>

  <p style="font-size: 12px; color: #777; margin-top: 20px;">
    This email was generated from the contact form on <strong>Needlon.com</strong>.
  </p>
</div>
`;