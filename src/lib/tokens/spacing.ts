/**
 * OptiMax Design Tokens - Spacing
 *
 * Based on 4px grid system.
 */

export const spacing = {
  0: '0px',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  2.5: '10px',
  3: '12px',
  3.5: '14px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
} as const

export const semanticSpacing = {
  /** Card padding */
  cardPaddingCompact: spacing[3],   // 12px
  cardPaddingDefault: spacing[6],   // 24px
  cardPaddingLarge: spacing[8],     // 32px

  /** Page padding */
  pagePaddingDefault: spacing[6],   // 24px
  pagePaddingLarge: spacing[8],     // 32px

  /** Gaps between major sections */
  sectionGap: spacing[6],           // 24px
  sectionGapLarge: spacing[8],      // 32px

  /** Gaps between elements within a section */
  elementGap: spacing[4],           // 16px
  elementGapSmall: spacing[3],      // 12px

  /** Inline spacing (icon + text, badge margins, etc.) */
  inlineGap: spacing[2],            // 8px
  inlineGapSmall: spacing[1],       // 4px

  /** Form field spacing */
  formFieldGap: spacing[5],         // 20px
  formLabelGap: spacing[1.5],       // 6px

  /** Table cell padding */
  tableCellPadding: spacing[3],     // 12px
  tableCellPaddingCompact: spacing[2], // 8px

  /** Sidebar width */
  sidebarWidth: '240px',
  sidebarCollapsedWidth: '64px',

  /** Header height */
  headerHeight: '56px',
} as const
