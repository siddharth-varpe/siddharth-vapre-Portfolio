export type ContentStatus = "draft" | "published" | "archived";

export interface BaseEntity {
  id?: string;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuditableEntity extends BaseEntity {
  createdBy?: string;
  updatedBy?: string;
}
