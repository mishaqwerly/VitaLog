export const navigationPages = [
  'overview',
  'patients',
  'schedule',
  'messages',
  'transactions',
] as const

export type NavigationPage = (typeof navigationPages)[number]

export function isNavigationPage(value: string): value is NavigationPage {
  return navigationPages.some((page) => page === value)
}
