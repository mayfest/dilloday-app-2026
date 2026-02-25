// Brand book colors — Dillo Day 2026
const crimsonDark = '#8a1e1b';
const crimsonMid = '#b52025';
const crimsonLight = '#e13f3f';
const blueDark = '#14375f';
const blueMid = '#084e8a';
const blueLight = '#1672b9';
const gold = '#fcb415';
const yellow = '#ffcd46';
const magenta = '#df4d9b';
const pink = '#e882b5';
const nearBlack = '#150c0c';
const cream = '#fffbeb';

export const Colors = {
  light: {
    text: cream, // light text on dark backgrounds
    background: blueDark, // #14375f — primary dark background
    tint: yellow, // #ffcd46 — primary accent / active state
    icon: blueLight, // #1672b9 — default icon color
    tabIconDefault: blueLight,
    tabIconSelected: yellow,
    card: gold, // #fcb415
    cardAlt: pink, // #e882b5
    cardText: blueDark, // #14375f — dark text on light cards
    action: magenta, // #df4d9b
    actionText: cream, // #fffbeb
    alert: crimsonMid, // #b52025
  },
  dark: {
    text: cream,
    background: nearBlack, // #150c0c — deepest dark background
    tint: yellow,
    icon: blueLight,
    tabIconDefault: blueLight,
    tabIconSelected: yellow,
    card: gold,
    cardAlt: pink,
    cardText: blueDark,
    action: magenta,
    actionText: cream,
    alert: crimsonMid,
  },
};

export const SemanticColors = {
  primary: blueDark,
  secondary: magenta,
  accent: yellow,
  error: crimsonMid,
  inactive: blueLight,
  success: blueMid,
  warning: gold,
  info: pink,
};
