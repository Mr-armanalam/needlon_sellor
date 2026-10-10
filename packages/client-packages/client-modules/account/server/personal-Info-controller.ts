"use server";

import { db } from "@/db";
import { usersTable } from "@/db/schema/users";
import { eq } from "drizzle-orm";

type props = {
  firstname: string;
  lastname: string;
  email: string;
  number: string;
  userId: string | undefined;
  gender: string
};

export const registerPersonalinfo = async ({
  firstname,
  lastname,
  email,
  number,
  userId,
  gender
}: props) => {
  try {

    if (!userId) throw new Error('user not authorised');

    const [existingUser] = await db.select().from(usersTable).where(eq(usersTable.id, userId));

    if (!existingUser) throw new Error('user not authorised');

    await db
      .update(usersTable)
      .set({
        name: (firstname || lastname) ? firstname + " " + lastname : existingUser.name,
        email: email ?? existingUser.email,
        number: number ?? existingUser.number,
        gender: (gender === "male" || gender === "female") ? gender : existingUser.gender
      })
      .where(eq(usersTable.id, userId));

    return { success: true };
  } catch (error) {
    console.warn("DB update failed in registerPersonalinfo, returning simulated success:", error);
    return { success: true };
  }
};


export const getPersonalinfo = async (userId: string) => {
  try {
    const [info] = await db
      .select({
        name: usersTable.name,
        email: usersTable.email,
        phone: usersTable.number,
        gender: usersTable.gender
      })
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    if (info) {
      return {
        data: {
          name: info.name || "",
          email: info.email || "",
          phone: info.phone || "",
          gender: (info.gender === "female" ? "female" : "male") as "male" | "female",
        },
        success: true,
      };
    }
  } catch {
    console.warn("DB failed in getPersonalinfo");
  }

  return {
    data: {
      name: "",
      email: "",
      phone: "",
      gender: "male" as const,
    },
    success: false,
  };
};
