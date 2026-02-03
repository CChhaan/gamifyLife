export interface TaskCategory {
  id: number;
  user_id: number;
  name: string;
  color: string;
  display_order: number;
  updatedAt: Date;
  createdAt: Date;
}

export type InfluenceAttr = "mind" | "body" | "social" | "discipline";

export const InfluenceAttrTextMap = {
  mind: "心智",
  body: "体魄",
  social: "社交",
  discipline: "自律",
} as const;

export interface TaskTag {
  id?: number;
  user_id?: number;
  name?: string;
  primary_attr?: InfluenceAttr | "";
  secondary_attr?: InfluenceAttr | null | "";
}
