export const easePremium = [0.32, 0.72, 0, 1] as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 48, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const stagger = {
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.1 },
  },
};
