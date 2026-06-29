export type IntegrationFetchOptions = {
  forceRefresh?: boolean;
};

export function platformFetchInit(
  options?: IntegrationFetchOptions,
): RequestInit {
  if (options?.forceRefresh) {
    return { cache: "no-store" };
  }

  return { next: { revalidate: 300 } };
}
