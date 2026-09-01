export type Status = "want_to_try" | "been_there";

export interface DimSumEntry {
  id: string;
  name: string;
  city: string;
  status: Status;
  rating: number | null;
  dish: string;
  note: string;
  createdAt: number;
}

export type FilterValue = "all" | Status;
export type SortValue = "newest" | "alpha" | "rating";
