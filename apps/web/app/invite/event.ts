// Single source of truth for the ceremony details. The invite page, countdown and
// the downloadable invitation image all read from here so the date never drifts.
export const EVENT = {
  startsAt: "2026-11-26T10:00:00+07:00",
  time: "10:00",
  weekday: "Thứ Năm",
  dateShort: "26.11.2026",
  dateLong: "Thứ Năm, ngày 26 tháng 11 năm 2026",
  place: "Sảnh trước tòa E",
  org: "Trường ĐH CNTT – ĐHQG TP.HCM",
  placeNote: "Ngay logo UIT bự chà bá",
} as const;
