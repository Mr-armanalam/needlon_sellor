"use server";
import { db } from "@/db";
import { usersTable } from "@/db/schema/users";
import { bcryptHash } from "@/lib/bcrypt";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import nodemailer from "nodemailer";

const getotp = async () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const encryptedOtp = await bcryptHash(otp);
  const expires = new Date(Date.now() + 10 * 60 * 1000);
  (await cookies()).set("verification", encryptedOtp, {
    maxAge: 10 * 60,
    expires,
    secure: true,
  });
  return otp;
};
export async function sendStyledOtpEmail(email: string) {
  const [existingUser] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  if (existingUser) {
    console.log("User already exists");
    throw new Error("User already exists");
  }

  const otp = await getotp();
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    secure: true,
  });

  const htmlContent = `
    <div style="max-width:600px;margin:auto;font-family:sans-serif;border:1px solid #e2e2e2;">
      <div style="background-color:#232f3e;padding:20px;text-align:center;">
       <h1 style="color:#fff; font-weight:bold;">Needlon</h1>
      </div>
      <div style="padding:30px;">
        <h2 style="margin-bottom:10px;">Verify your identity</h2>
        <p>Hello,</p>
        <p style="line-height:1.5;">
          We detected a sign-in attempt to your account. If you initiated this, enter the following code to verify your identity:
        </p>
        <div style="margin:30px 0;text-align:center;">
          <div style="font-size:36px;font-weight:bold;color:#111;">${otp}</div>
          <p style="color:gray;font-size:13px;">(This code will expire in 10 minutes.)</p>
        </div>
        <p style="line-height:1.5;">
          If you did not initiate this request, please secure your account by changing your password immediately. 
        </p>
      </div>
      <div style="background:#f7f7f7;padding:20px;font-size:13px;color:#555;">
        <p>
          If you have any questions, contact our support: 
          <a href="https://needlon.vercel.app/support" style="color:#0073bb;">https://needlon.vercel.app/support</a>
        </p>
        <p>
          We will never ask for your password or payment info via email. If you receive a suspicious email, do not click any links and report it.
        </p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"Needlon" <${process.env.EMAIL_SERVER_USER}>`,
    to: email,
    subject: "Verify your identity – OTP Code",
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions).catch((error) => {
    if (error.message) {
      throw new Error("Otp is not sent");
    }
  });
}
      // <img src="https://a0.awsstatic.com/libra-css/images/logos/aws_smile-header-desktop-en-white_59x35.png" alt="logo" style="height:35px;" />
