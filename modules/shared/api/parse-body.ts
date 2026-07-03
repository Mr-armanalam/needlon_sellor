import { z } from "zod";
import { NextRequest } from "next/server";

export async function parseBody<T extends z.ZodTypeAny>(
    request: NextRequest,
    schema: T,
): Promise<z.infer<T>> {
    const body = await request.json();

    return schema.parse(body);
}