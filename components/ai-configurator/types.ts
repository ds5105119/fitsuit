export type ConfigOption = {
  id: string;
  group?: string;
  title: string;
  subtitle: string;
  image: string;
};

export type CategoryKey = "사진 업로드" | "원단" | "재킷" | "바지" | "조끼" | "코트" | "셔츠" | "구두";
export type WearCategory = Exclude<CategoryKey, "사진 업로드">;
export type SelectionState = Record<WearCategory, Record<string, ConfigOption>>;

export type Preset = {
  id: number;
  name: string;
  selections: SelectionState;
  previewUrl: string;
};

export type StoredSelectionItem = {
  category: WearCategory;
  group: string | null;
  title: string;
  subtitle: string;
};

export type StoredSelections = StoredSelectionItem[];

export type MeasurementKey = "height" | "weight" | "neck" | "chest" | "belly" | "waist" | "hip" | "thigh";
export type Measurements = Partial<Record<MeasurementKey, string>> | null;
