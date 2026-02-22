/** 道具类型枚举 */
export enum ItemType {
  FOOD = "FOOD",
  POTION = "POTION",
  TICKET = "TICKET",
  OTHER = "OTHER",
}

/** 道具上架状态枚举 */
export enum ItemStatus {
  ON_SHELF = "ON_SHELF",
  OFF_SHELF = "OFF_SHELF",
}

export const ItemEffectType = {
  // 宠物饥饿值
  hunger: "饥饿值",
  // 宠物经验
  petExp: "宠物经验",
  // 宠物亲密度
  petIntimacy: "宠物亲密度",
}

/** 道具使用效果类型（对应JSON字段） */
export interface ItemEffect {
  // 精准定义示例（根据业务需求调整）：
  petExp?: number; // 宠物经验
  hunger?: number; // 饥饿值
  petIntimacy: number; // 宠物亲密度
}

/** 道具基础类型（对应数据库表字段） */
export interface Item {
  /** 道具ID */
  id?: number;
  /** 道具类型 */
  type: "FOOD" | "POTION" | "TICKET" | "OTHER";
  /** 道具名称 */
  name: string;
  /** 道具描述（可选） */
  description?: string | null;
  /** 图标地址（可选） */
  icon_url?: string | null;
  /** 售价（金币） */
  price: number;
  /** 上架状态 */
  status: "ON_SHELF" | "OFF_SHELF";
  /** 使用效果JSON */
  effect: ItemEffect;
  /** 创建时间 */
  created_at?: Date;
  /** 更新时间 */
  updated_at?: Date;
}

export interface Inventory {
  /** 库存ID */
  id?: number;
  /** 所属用户ID（外键关联User表） */
  user_id?: number;
  /** 道具ID（外键关联Item表） */
  item_id: number;
  /** 道具数量（消耗品，非负） */
  quantity: number;
  /** 创建时间 */
  created_at?: Date;
  /** 更新时间 */
  updated_at?: Date;
  item?: Item;

}
