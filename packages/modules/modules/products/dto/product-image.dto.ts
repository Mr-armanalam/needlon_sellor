export interface CreateProductImageDto {
  productId: string;
  imageUrl: string;
  fileName: string;
  mimeType: string;
  width?: number;
  height?: number;
  fileSize?: number;
  checksum?: string;
  storagePath?: string;
  storageKey?: string;
  mediaType?: "IMAGE" | "VIDEO" | string;
  altText?: string;
  displayOrder?: number;
  isPrimary?: boolean;
}

export interface UpdateImageOrderDto {
  imageIds: string[];
}

export interface SetPrimaryThumbnailDto {
  imageId: string;
}
