export interface CreateCategoryDTO {
  name: string;
  parentId?: string | null;
  description?: string | null;
  iconUrl?: string | null;
  bannerUrl?: string | null;
  displayOrder?: number;
}

export interface UpdateCategoryDTO {
  id: string;
  name?: string;
  parentId?: string | null;
  description?: string | null;
  iconUrl?: string | null;
  bannerUrl?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}

export interface MoveCategoryDTO {
  id: string;
  newParentId?: string | null;
}
