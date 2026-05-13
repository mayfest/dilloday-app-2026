import { Platform, type TextStyle, type ViewStyle } from 'react-native';

/** Full-width title row so italic Sofachrome glyphs are not clipped (especially on Android). */
export function sofachromeTitleContainer(): ViewStyle {
  return {
    width: '100%',
    alignSelf: 'stretch',
    alignItems: 'stretch',
    justifyContent: 'center',
    overflow: 'visible',
  };
}

const TITLE_YELLOW = '#FFEB3B';

/** SofachromeIt heading with safe horizontal bleed room. */
export function sofachromeTitleTextStyle(
  fontSize: number,
  extra?: Partial<TextStyle>
): TextStyle {
  const { lineHeight: lhOverride, ...rest } = extra ?? {};
  return {
    width: '100%',
    color: TITLE_YELLOW,
    fontFamily: 'SofachromeIt',
    fontSize,
    lineHeight: lhOverride ?? Math.round(fontSize * 1.18),
    textAlign: 'center',
    overflow: 'visible',
    /** Balanced insets so italic Sofachrome reads centered; slight right bias for final glyph. */
    paddingLeft: 22,
    paddingRight: 26,
    ...Platform.select({ android: { includeFontPadding: false }, default: {} }),
    ...rest,
  };
}
