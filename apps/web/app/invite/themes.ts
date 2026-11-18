import type { GuestType } from "@/lib/types";

// Colors for each theme live in globals.css under [data-guest-theme="<key>"]
export type InviteThemeKey = "friends" | "family" | "seniors" | "juniors" | "special" | "everyone";

export type InviteTheme = {
  key: InviteThemeKey;
  cloudEmoji: string;
  ornament: string; // small icon on the divider under the guest's name
  floatingEmojis: string[];
  confettiColors: string[];
  copy: {
    introText: string;
    greeting: string;
    inviteBody: string;
    rsvpCta: string;
    closingLine: string;
    timeNote: string;
    countdownTitle: string;
    lostContact: string;
    rsvpPrompt: string;
    namePlaceholder: string;
    yes: { emoji: string; label: string };
    no: { emoji: string; label: string };
    wishPlaceholder: string;
    // Shown in place of the form once the guest has replied
    thanks: {
      yes: { emoji: string; title: string; body: string };
      no: { emoji: string; title: string; body: string };
      wish: string; // acknowledges the wish the guest left
    };
    footer: string;
  };
};

const FOOTER = "🎓 Made with ❤️ for Lâm Trường's Graduation Day 🎓";

// Playful, mình/bạn, slang
const friends: InviteTheme = {
  key: "friends",
  cloudEmoji: "☁️",
  ornament: "⭐",
  floatingEmojis: ["🎓", "✨", "🎈", "🎉", "⭐", "🥳"],
  confettiColors: ["#fce18a", "#ff726d", "#b48def", "#f4306d", "#009fe3", "#34a853"],
  copy: {
    introText: "Thân gửi những người bạn thân yêu...\nNếu bạn đọc được những dòng tin nhắn này...",
    greeting: "Thân mời",
    inviteBody: "đến chung vui trong ngày tốt nghiệp của mình nha! 🎉",
    rsvpCta: "Xác nhận ngay 💌",
    closingLine: "Được chụp cùng bạn một bức hình (và nhận quà của bạn) là niềm vui mà mình luôn hằng ao ước.",
    timeNote: "Đến đúng giờ nha mấy ní, trễ là phạt á! 🤪",
    countdownTitle: "⏳ Đếm ngược tới ngày được gặp Lâm Trường!",
    lostContact: "Liên hệ nếu bạn bị lạc nhé!",
    rsvpPrompt: "Bạn có đến chung vui cùng mình được không?",
    namePlaceholder: "Tên của bạn là gì dạ...",
    yes: { emoji: "🥳", label: "Chắc chắn gòi!" },
    no: { emoji: "😢", label: "Rất tiếc lun" },
    wishPlaceholder: "Gửi vài lời yêu thương đến mình nha...",
    thanks: {
      yes: { emoji: "🥳", title: "Hẹn gặp bạn nha!", body: "Mình nhận được xác nhận của bạn rồi. Cảm ơn bạn đã dành thời gian đến chung vui, nhớ đến đúng giờ nhé!" },
      no: { emoji: "🥹", title: "Tiếc quá, nhưng mình hiểu mà!", body: "Cảm ơn bạn đã báo cho mình biết. Hẹn bạn dịp khác nha, mình vẫn nhớ bạn nhiều lắm!" },
      wish: "Cảm ơn lời chúc của bạn, mình đọc rồi nè 💌",
    },
    footer: FOOTER,
  },
};

// Formal, con / gia đình, no slang
const family: InviteTheme = {
  key: "family",
  cloudEmoji: "🌼",
  ornament: "🌼",
  floatingEmojis: ["🌼", "🏮", "🎓", "🌸", "✨"],
  confettiColors: ["#f6ad55", "#d69e2e", "#c05621", "#fbd38d", "#fff5d6"],
  copy: {
    introText: "Kính gửi gia đình thương yêu...\nCon xin gửi lời tri ân sâu sắc nhất tới mọi người...",
    greeting: "Kính mời",
    inviteBody: "đến tham dự buổi lễ tốt nghiệp và chia vui cùng con.",
    rsvpCta: "Xác nhận tham dự",
    closingLine: "Sự hiện diện của gia đình là niềm vinh hạnh và động lực to lớn cho con.",
    timeNote: "Kính mong mọi người đến đúng giờ để buổi lễ thêm phần trọn vẹn.",
    countdownTitle: "⏳ Chỉ còn ít ngày nữa là đến lễ tốt nghiệp của con",
    lostContact: "Cần hỗ trợ, xin liên hệ con",
    rsvpPrompt: "Gia đình mình có tham dự được không ạ?",
    namePlaceholder: "Xin nhập họ tên...",
    yes: { emoji: "🌼", label: "Sẽ tham dự" },
    no: { emoji: "🙏", label: "Rất tiếc không thể đến" },
    wishPlaceholder: "Đôi lời nhắn gửi đến con...",
    thanks: {
      yes: { emoji: "🌼", title: "Con cảm ơn gia đình ạ!", body: "Con đã nhận được xác nhận. Sự hiện diện của mọi người là niềm vinh dự lớn của con, con rất mong được đón mọi người ạ." },
      no: { emoji: "🙏", title: "Con hiểu và cảm ơn ạ", body: "Con cảm ơn đã cho con biết. Kính chúc mọi người luôn khỏe mạnh, con sẽ gửi hình ảnh buổi lễ cho mọi người sau ạ." },
      wish: "Con cảm ơn những lời nhắn nhủ của mọi người ạ 🙏",
    },
    footer: "🎓 Lễ tốt nghiệp của Lâm Trường — Con cảm ơn gia đình 🎓",
  },
};

// Respectful but warm, em/anh chị (seniors, mentors, colleagues)
const seniors: InviteTheme = {
  key: "seniors",
  cloudEmoji: "☁️",
  ornament: "✨",
  floatingEmojis: ["🎓", "✨", "📘", "🌟", "🎈"],
  confettiColors: ["#5a67d8", "#7f9cf5", "#c3dafe", "#f6c343", "#434190"],
  copy: {
    introText: "Gửi anh chị...\nEm có một tấm thiệp nhỏ muốn gửi đến anh chị...",
    greeting: "Trân trọng kính mời",
    inviteBody: "đến chung vui cùng em trong ngày tốt nghiệp.",
    rsvpCta: "Xác nhận tham dự",
    closingLine: "Sự có mặt của anh chị là niềm vinh dự và động lực lớn với em trong ngày đặc biệt này.",
    timeNote: "Anh chị sắp xếp đến đúng giờ giúp em nhé, em cảm ơn ạ!",
    countdownTitle: "⏳ Đếm ngược tới ngày tốt nghiệp của em",
    lostContact: "Cần hỗ trợ, anh chị cứ liên hệ em nhé!",
    rsvpPrompt: "Anh chị có thể đến chung vui cùng em được không ạ?",
    namePlaceholder: "Tên của anh chị...",
    yes: { emoji: "🎉", label: "Anh chị sẽ đến" },
    no: { emoji: "🙏", label: "Rất tiếc, không đến được" },
    wishPlaceholder: "Anh chị nhắn em đôi lời nhé...",
    thanks: {
      yes: { emoji: "🎉", title: "Em cảm ơn anh chị ạ!", body: "Em đã nhận được xác nhận. Em rất mong được đón anh chị, anh chị nhớ đến đúng giờ giúp em nhé!" },
      no: { emoji: "🙏", title: "Em hiểu ạ, em cảm ơn anh chị!", body: "Em cảm ơn anh chị đã báo cho em biết. Hẹn anh chị dịp khác, em vẫn luôn biết ơn sự giúp đỡ của anh chị ạ." },
      wish: "Em cảm ơn lời nhắn của anh chị ạ 🙏",
    },
    footer: "🎓 Lễ tốt nghiệp của Lâm Trường — Em cảm ơn anh chị 🎓",
  },
};

// Plain and straightforward, anh/em (younger siblings and cousins)
const juniors: InviteTheme = {
  key: "juniors",
  cloudEmoji: "🌱",
  ornament: "✦",
  floatingEmojis: ["🎓", "✨", "🌟"],
  confettiColors: ["#2f9e6b", "#48bb8a", "#b5ead0", "#f6c343", "#1f7a52"],
  copy: {
    introText: "Anh gửi em thiệp mời.\nAnh sắp tốt nghiệp.",
    greeting: "Thư mời",
    inviteBody: "Anh mời em đến dự lễ tốt nghiệp của anh.",
    rsvpCta: "Xác nhận tham dự",
    closingLine: "Anh mong em sắp xếp thời gian đến dự và chụp chung với anh một tấm hình.",
    timeNote: "Em đến đúng giờ nha.",
    countdownTitle: "⏳ Còn bao lâu nữa đến ngày tốt nghiệp",
    lostContact: "Cần hỗ trợ thì liên hệ anh.",
    rsvpPrompt: "Em có tham dự được không?",
    namePlaceholder: "Tên của em",
    yes: { emoji: "✅", label: "Em sẽ đến" },
    no: { emoji: "🙏", label: "Em không đến được" },
    wishPlaceholder: "Em muốn nhắn gì với anh (không bắt buộc)",
    thanks: {
      yes: { emoji: "✅", title: "Anh đã nhận được xác nhận", body: "Cảm ơn em đã sắp xếp thời gian. Hẹn gặp em tại buổi lễ, em nhớ đến đúng giờ." },
      no: { emoji: "🙏", title: "Anh đã nhận được phản hồi", body: "Cảm ơn em đã báo cho anh biết. Hẹn gặp em vào dịp khác." },
      wish: "Anh đã đọc lời nhắn của em, cảm ơn em.",
    },
    footer: "🎓 Lễ tốt nghiệp của Lâm Trường 🎓",
  },
};

// Romantic, anh/em
const special: InviteTheme = {
  key: "special",
  cloudEmoji: "💖",
  ornament: "💖",
  floatingEmojis: ["💖", "🌸", "💕", "✨", "🌷"],
  confettiColors: ["#ff8fab", "#e0457b", "#fbb6ce", "#ffd1e3", "#ffffff"],
  copy: {
    introText: "Gửi một nửa thế giới của anh...\nNgày hôm nay, anh muốn chia sẻ niềm vui này cùng em...",
    greeting: "Gửi",
    inviteBody: "anh muốn có em bên cạnh trong ngày tốt nghiệp này. 💕",
    rsvpCta: "Trả lời anh nhé 💌",
    closingLine: "Sự hiện diện của em là niềm hạnh phúc lớn nhất trong ngày đặc biệt này của anh. ✨",
    timeNote: "Em đến sớm một chút nha, anh muốn gặp em trước giờ lễ 💕",
    countdownTitle: "⏳ Đếm ngược tới ngày anh được gặp em 💖",
    lostContact: "Lạc đường thì gọi anh liền nha!",
    rsvpPrompt: "Em sẽ đến bên anh trong ngày này chứ?",
    namePlaceholder: "Tên của em...",
    yes: { emoji: "💖", label: "Em sẽ đến!" },
    no: { emoji: "🥺", label: "Em bận mất rồi" },
    wishPlaceholder: "Gửi anh vài lời nhé...",
    thanks: {
      yes: { emoji: "💖", title: "Anh chờ em nha!", body: "Anh nhận được rồi. Cảm ơn em đã đến bên anh trong ngày đặc biệt này." },
      no: { emoji: "🥺", title: "Anh hiểu mà, em đừng áy náy nha", body: "Cảm ơn em đã báo cho anh biết. Mình hẹn một dịp khác nhé, anh sẽ kể em nghe hết." },
      wish: "Anh đọc lời nhắn của em rồi, cảm ơn em nhiều 💕",
    },
    footer: "💖 Made with love for you — Lâm Trường 🎓",
  },
};

// Friendly and neutral, mình/mọi người
const everyone: InviteTheme = {
  key: "everyone",
  cloudEmoji: "⭐",
  ornament: "⭐",
  floatingEmojis: ["⭐", "🎓", "✨", "🎈", "🎉"],
  confettiColors: ["#f6c343", "#319795", "#2c7a7b", "#9fd8d6", "#1e3a5f"],
  copy: {
    introText: "Gửi mọi người thân yêu...\nCảm ơn vì đã ghé qua tấm thiệp nhỏ này của mình...",
    greeting: "Thân mời",
    inviteBody: "đến chung vui trong ngày tốt nghiệp của mình.",
    rsvpCta: "Xác nhận tham dự 💌",
    closingLine: "Sự có mặt của mọi người là món quà ý nghĩa nhất với mình trong ngày này.",
    timeNote: "Mọi người nhớ đến đúng giờ nha! ⏰",
    countdownTitle: "⏳ Đếm ngược tới ngày tốt nghiệp của Lâm Trường!",
    lostContact: "Cần hỗ trợ thì liên hệ mình nha!",
    rsvpPrompt: "Bạn có đến chung vui cùng mình được không?",
    namePlaceholder: "Nhập tên của bạn...",
    yes: { emoji: "🎉", label: "Mình sẽ đến!" },
    no: { emoji: "😢", label: "Tiếc quá, không đến được" },
    wishPlaceholder: "Gửi vài lời chúc đến mình nha...",
    thanks: {
      yes: { emoji: "🎉", title: "Hẹn gặp bạn nhé!", body: "Mình đã nhận được xác nhận của bạn. Cảm ơn bạn đã đến chung vui, nhớ đến đúng giờ nha!" },
      no: { emoji: "😢", title: "Tiếc quá, hẹn dịp khác nhé!", body: "Cảm ơn bạn đã báo cho mình biết, mình vẫn rất trân trọng tấm lòng của bạn." },
      wish: "Cảm ơn lời chúc của bạn, mình rất vui khi đọc 💌",
    },
    footer: FOOTER,
  },
};

const THEMES: Record<GuestType, InviteTheme> = {
  "Bạn bè": friends,
  "Người thân": family,
  "Anh chị": seniors,
  "Em": juniors,
  "Đặc biệt": special,
  "Tất cả": everyone,
};

export function getInviteTheme(type: string): InviteTheme {
  return THEMES[type as GuestType] ?? friends;
}
