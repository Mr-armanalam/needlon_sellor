import { z } from "zod";
import { isAllowedMediaMimeType } from "../constants/media";

export const createImageSchema = z.object({
  imageUrl: z.string().min(1, "Image URL is required"),
  fileName: z.string().min(1, "File name is required"),
  mimeType: z
    .string()
    .refine((val) => isAllowedMediaMimeType(val), {
      message: "Unsupported media format. Must be a valid image or video MIME type.",
    })
    .default("image/jpeg"),
  width: z.number().int().positive().optional().default(800),
  height: z.number().int().positive().optional().default(800),
  fileSize: z.number().int().positive().optional().default(1024),
  checksum: z.string().optional(),
  storagePath: z.string().optional(),
  storageKey: z.string().optional(),
  mediaType: z.enum(["IMAGE", "VIDEO"]).optional(),
  altText: z.string().optional(),
  displayOrder: z.number().int().min(0).optional().default(0),
  isPrimary: z.boolean().optional().default(false),
});

export const updateImageOrderSchema = z.object({
  imageIds: z.array(z.string().uuid("Invalid image ID format")),
});

export const setPrimaryThumbnailSchema = z.object({
  imageId: z.string().uuid("Invalid image ID format"),
});

export type CreateImageSchema = z.infer<typeof createImageSchema>;
export type UpdateImageOrderSchema = z.infer<typeof updateImageOrderSchema>;
export type SetPrimaryThumbnailSchema = z.infer<typeof setPrimaryThumbnailSchema>;
