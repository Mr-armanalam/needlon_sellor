import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

const FROM = process.env.EMAIL_SERVER_USER!;

type SendMailOptions = {
  to: string;
  subject: string;
  html: string;
};

async function sendMail({ to, subject, html }: SendMailOptions) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject,
    html,
  });
}

function otpTemplate(title: string, description: string, code: string) {
  return `
    <div
      style="
        font-family:Arial,sans-serif;
        max-width:500px;
        margin:0 auto;
        padding:24px;
        border:1px solid #e5e7eb;
        border-radius:12px;
      "
    >
      <h2 style="margin-bottom:12px;">
        ${title}
      </h2>

      <p style="color:#4b5563;">
        ${description}
      </p>

      <div
        style="
          font-size:36px;
          font-weight:700;
          letter-spacing:8px;
          text-align:center;
          padding:24px 0;
        "
      >
        ${code}
      </div>

      <p style="color:#6b7280;font-size:14px;">
        This code is valid for 10 minutes.
      </p>

      <p style="color:#6b7280;font-size:14px;">
        If you didn't request this, you can safely ignore this email.
      </p>
    </div>
  `;
}

export async function sendOtpEmail(email: string, code: string) {
  await sendMail({
    to: email,
    subject: "Verify your email address",
    html: otpTemplate(
      "Verify Your Email",
      "Use the following verification code to complete your registration.",
      code,
    ),
  });
}

export async function sendResetEmail(email: string, code: string) {
  await sendMail({
    to: email,
    subject: "Reset your password",
    html: otpTemplate(
      "Reset Password",
      "Use the following verification code to reset your password.",
      code,
    ),
  });
}


// export async function sendOtpEmail(email: string, code: string) {
//   await resend.emails.send({
//     from: FROM,
//     to: email,
//     subject: "Your login code",
//     html: `
//       <div style="font-family:sans-serif;max-width:400px;margin:0 auto">
//         <h2>Your login code</h2>
//         <p>Enter this code to sign in. It expires in 10 minutes.</p>
//         <div style="font-size:36px;font-weight:bold;letter-spacing:8px;padding:24px 0">
//           ${code}
//         </div>
//         <p style="color:#666;font-size:14px">If you didn't request this, ignore this email.</p>
//       </div>
//     `,
//   });
// }

// export async function sendResetEmail(email: string, code: string) {
//   await resend.emails.send({
//     from: FROM,
//     to: email,
//     subject: "Reset your password",
//     html: `
//       <div style="font-family:sans-serif;max-width:400px;margin:0 auto">
//         <h2>Reset your password</h2>
//         <p>Enter this code to reset your password. It expires in 15 minutes.</p>
//         <div style="font-size:36px;font-weight:bold;letter-spacing:8px;padding:24px 0">
//           ${code}
//         </div>
//         <p style="color:#666;font-size:14px">If you didn't request this, ignore this email.</p>
//       </div>
//     `,
//   });
// }