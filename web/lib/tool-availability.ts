export type ToolAvailabilityCopy = {
  badge: string;
  detail: string;
  href?: string;
};

export function toolEffectiveEnabled(
  savedEnabled: boolean,
  available: boolean,
  comingSoon: boolean,
): boolean {
  return savedEnabled && available && !comingSoon;
}

export function toolAvailabilityCopy(
  reason: string | null | undefined,
  t: (key: string) => string,
): ToolAvailabilityCopy {
  if (reason === "search_provider_not_configured") {
    return {
      badge: t("Not configured"),
      detail: t(
        "Choose a provider in Search settings first. DuckDuckGo needs no API key.",
      ),
      href: "/settings#search",
    };
  }
  if (reason === "search_credentials_missing") {
    return {
      badge: t("Credentials missing"),
      detail: t(
        "The selected search provider needs credentials. Check Search settings.",
      ),
      href: "/settings#search",
    };
  }
  return {
    badge: t("tools.availability.unavailable"),
    detail: t("This tool's runtime service is unavailable."),
  };
}
