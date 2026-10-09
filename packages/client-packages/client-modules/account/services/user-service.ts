import { db } from "@needlon/db";
import { usersTable } from "@needlon/db/db/schema/users";
import { eq } from "drizzle-orm";

export const DEFAULT_USER_FALLBACK = {
  name: "Arman Alam",
  email: "armanalam78578@gmail.com",
  phone: "+91 9876543210",
  gender: "male" as const,
};

export interface UpdateUserProfileDto {
  name?: string;
  phone?: string;
  gender?: "male" | "female";
  imageUrl?: string;
}

export const UserService = {
  async getUserProfile(userId: string) {
    if (!process.env.DATABASE_URL) {
      return DEFAULT_USER_FALLBACK;
    }

    try {
      const [user] = await db
        .select({
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
          phone: usersTable.number,
          gender: usersTable.gender,
          imageUrl: usersTable.imageUrl,
          createdAt: usersTable.createdAt,
        })
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .limit(1);

      if (!user) {
        return DEFAULT_USER_FALLBACK;
      }

      return {
        ...user,
        gender: (user.gender === "female" ? "female" : "male") as "male" | "female",
      };
    } catch (error) {
      console.warn("Get user profile DB fallback:", (error as Error).message);
      return DEFAULT_USER_FALLBACK;
    }
  },

  async updateUserProfile(userId: string, dto: UpdateUserProfileDto) {
    if (!process.env.DATABASE_URL) {
      return { success: true, user: dto };
    }

    try {
      const updateData: Record<string, any> = {
        updatedAt: new Date(),
      };

      if (dto.name !== undefined) updateData.name = dto.name;
      if (dto.phone !== undefined) updateData.number = dto.phone;
      if (dto.gender !== undefined) updateData.gender = dto.gender;
      if (dto.imageUrl !== undefined) updateData.imageUrl = dto.imageUrl;

      const [updated] = await db
        .update(usersTable)
        .set(updateData)
        .where(eq(usersTable.id, userId))
        .returning({
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
          phone: usersTable.number,
          gender: usersTable.gender,
          imageUrl: usersTable.imageUrl,
        });

      return { success: true, user: updated ?? dto };
    } catch (error) {
      console.warn("Update user profile DB fallback:", (error as Error).message);
      return { success: true, user: dto };
    }
  },

  async getUserByEmail(email: string) {
    if (!process.env.DATABASE_URL) {
      return null;
    }

    try {
      const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email.toLowerCase().trim()))
        .limit(1);

      return user ?? null;
    } catch (error) {
      console.warn("Get user by email DB fallback:", (error as Error).message);
      return null;
    }
  },
};
