'use server'
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

// Hash a string
export async function bcryptHash(data: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(data, saltRounds);
}

// Compare plaintext with hashed string
export async function bcryptCompare(data: string, hashed: string): Promise<boolean> {
  return await bcrypt.compare(data, hashed);
}

export const getCookieValue = async(data:string)=>{
  const cookiestore = await cookies()
  const valuedata = cookiestore.get(data);
  return valuedata
}