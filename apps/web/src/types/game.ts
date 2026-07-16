export type GameId = string;

export interface NumberFieldConfig {
  count: number;
  min: number;
  max: number;
  unique: boolean;
  sortAutomatically: boolean;
}

export type ExtraFieldType = "number" | "string";

export interface ExtraFieldConfig {
  key: string;
  label: string;
  type: ExtraFieldType;
  required: boolean;
  min?: number;
  max?: number;
  pattern?: string;
}

export interface GameConfig {
  id: GameId;
  label: string;
  numbers: NumberFieldConfig;
  extras: ExtraFieldConfig[];
}
