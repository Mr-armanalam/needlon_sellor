/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/db";
import { usersTable } from "@/db/schema/users";
import { bcryptCompare, bcryptHash, getCookieValue } from "@/lib/bcrypt";
import { eq } from "drizzle-orm";

export const getSignUp = async ({
  firstname,
  lastname,
  email,
  password,
  pin,
}: {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  pin: string;
}) => {
  if (!email || !password) {
    return { success: false, message: "Email and password are required" };
  }

  try {
    const serverotp = await getCookieValue("verification");
    if (!serverotp || !serverotp.value)
      return { success: false, message: "Invalid Otp" };
    const decryptedServerOtp = await bcryptCompare(pin, serverotp.value);
    if (!decryptedServerOtp) {
      return {
        success: false,
        message: "otp verification failed",
      };
    }

    const encPassword = await bcryptHash(password);

    const [existingUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existingUser) {
      return { success: false, message: "This email is already registered." };
    }

    const [user] = await db
      .insert(usersTable)
      .values({
        name: `${firstname} ${lastname}`.trim(),
        email,
        password: encPassword,
      })
      .returning();

    if (!user) {
      return { success: false, message: "Failed to create user account." };
    }

    return { success: true, message: "ok" };
  } catch (error: any) {
    console.error("Signup Error:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred.",
    };
  }
};

// export const isRegistered = async ({
//   email,
//   password,
// }: {
//   email: string;
//   password: string;
// }) => {
//   if (!email || !password) {
//     return {
//       success: false,
//       message: "Email and password are required",
//     };
//   }
//   try {
//     const [user] = await db
//       .select({ email: usersTable.email })
//       .from(usersTable)
//       .where(eq(usersTable.email, email));

//     if (!user) {
//       return({success: false, message: "User not found, please Sign Up first!"});
//     }

//     const [validUser] = await db
//       .select({ email: usersTable.email, password: usersTable.password })
//       .from(usersTable)
//       .where(
//         and(eq(usersTable.email, email), eq(usersTable.password, password)),
//       );

//     if (!validUser) {
//       return {
//         success: false,
//         message: "Email or Password is not correct",
//       };
    
//     }

//     return { success: true, message: "ok" };
//   } catch (error: any) {
//     console.log(error.message);
//     return {
//       success: false,
//       message: error.message || "An unexpected error occurred.",
//     }
//   }
// };
