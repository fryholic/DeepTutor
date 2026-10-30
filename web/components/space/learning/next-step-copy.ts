// i18n keys for the mastery next-step copy; views resolve them with `t()`.

export const TEACH_FIRST_PROFILE_LABEL = "Teach first, then check understanding";

export const NEXT_LABELS: Record<string, string> = {
  probe: "Start with a probe and test out if you already know it",
  teach: "Learn this knowledge point before checking understanding",
  practice: "Practice until you reliably clear the mastery gate",
  assess: "Explain this clearly in your own words",
  review: "Revisit this memory beacon",
  answer_pending: "Complete the answer your tutor is waiting for",
  complete: "The whole territory is illuminated",
};

export const NEXT_CTA_LABELS: Record<string, string> = {
  teach: "Learn this knowledge point",
  review: "Start this review",
  answer_pending: "Answer in the original session",
  complete: "Keep exploring",
};
