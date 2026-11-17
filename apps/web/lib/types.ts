export const GUEST_TYPES = ["Người thân", "Bạn bè", "Anh chị", "Đặc biệt", "Tất cả"] as const;

export type GuestType = (typeof GUEST_TYPES)[number];

export type Guest = {
  id?: string;
  shortId: string;
  name: string;
  title: string;
  type: GuestType | string;
  isAttending: boolean | null;
  wish: string | null;
};

export type GuestStats = {
  total: number;
  attending: number;
  notAttending: number;
  noResponse: number;
};
