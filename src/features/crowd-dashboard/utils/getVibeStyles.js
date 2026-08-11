// src/features/crowd-dashboard/utils/getVibeStyles.js
export const getVibeStatus = (density) => {
  if (density >= 0.7) return {
    label: "Congested",
    message: "Expect long wait times. Consider a side-street alternative.",
    color: "text-red-400",
    bg: "bg-red-950/30"
  };
  if (density <= 0.4) return {
    label: "Zen",
    message: "Perfect for photography. The area is currently peaceful.",
    color: "text-green-400",
    bg: "bg-green-950/30"
  };
  return {
    label: "Moderate",
    message: "Typical Tokyo energy. Moving steadily.",
    color: "text-blue-400",
    bg: "bg-blue-950/30"
  };
};