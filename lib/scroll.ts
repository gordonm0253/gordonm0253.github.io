const BASE_SCROLL_LENGTH_VH = 3;

export const SECTION_STARTS = [0, 0.45] as const;
export const SECTION_TARGETS = [0, 0.62] as const;

export function getScrollLength(extraScroll = 0, viewportHeight = window.innerHeight) {
  return viewportHeight * BASE_SCROLL_LENGTH_VH + extraScroll;
}
