export interface CategoryEntity {
  id: string;
  parentId?: string | null;
  name: string;
  slug: string;
  description?: string | null;
  iconUrl?: string | null;
  bannerUrl?: string | null;
  displayOrder?: number | null;
  level: number;
  isActive?: boolean | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface CategoryTreeNode extends CategoryEntity {
  children: CategoryTreeNode[];
}
