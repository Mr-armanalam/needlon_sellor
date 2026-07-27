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
