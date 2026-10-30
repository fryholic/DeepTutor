import { act, fireEvent, render, screen } from "@testing-library/react";
import { createInstance } from "i18next";
import { I18nextProvider } from "react-i18next";
import { expect, it, vi } from "vitest";

import SettingsNav from "@/components/settings/SettingsNav";
import {
  DASHBOARD_GROUPS,
  PERSONALIZATION_GROUPS,
} from "@/components/space/dashboard-groups";
import {
  NEXT_CTA_LABELS,
  NEXT_LABELS,
  TEACH_FIRST_PROFILE_LABEL,
} from "@/components/space/learning/next-step-copy";
import { SETTINGS_CATEGORIES } from "@/features/settings/navigation/settings-nav";
import {
  SETTINGS_PAGE_GROUPS,
  settingsPageLabel,
  visibleSettingsPages,
} from "@/features/settings/navigation/settings-pages";
import en from "@/locales/en/app.json";
import ko from "@/locales/ko/app.json";
import zh from "@/locales/zh/app.json";

vi.mock("next/navigation", () => ({
  usePathname: () => "/settings/general",
}));

const access = {
  resolved: true,
  hideAdminOnly: false,
  showLearnerOnly: true,
  showGuardianOnly: true,
};

vi.mock("@/features/settings/navigation/SettingsAccessProvider", () => ({
  useSettingsAccess: () => ({
    resolved: true,
    hideAdminOnly: false,
    showLearnerOnly: true,
    showGuardianOnly: true,
  }),
}));

it("renders and searches Korean settings while keeping English names searchable", async () => {
  const i18n = createInstance();
  await i18n.init({
    lng: "ko",
    fallbackLng: "en",
    keySeparator: false,
    nsSeparator: false,
    resources: { en: { translation: en }, ko: { translation: ko }, zh: { translation: zh } },
    interpolation: { escapeValue: false },
  });
  render(
    <I18nextProvider i18n={i18n}>
      <SettingsNav />
    </I18nextProvider>,
  );

  expect(screen.getByText("개인 설정")).toBeInTheDocument();
  expect(screen.getByText("모델 및 서비스")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "데이터 이전" })).toHaveAttribute("href", "/settings/data-migration");

  const search = screen.getByRole("textbox");
  fireEvent.change(search, { target: { value: "데이터 이전" } });
  expect(screen.getByText("검색 결과")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "데이터 이전" })).toBeInTheDocument();
  fireEvent.change(search, { target: { value: "Data migration" } });
  expect(screen.getByRole("link", { name: "데이터 이전" })).toBeInTheDocument();
  fireEvent.change(search, { target: { value: "" } });

  await act(async () => { await i18n.changeLanguage("zh"); });
  expect(screen.getByText("个人")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "数据迁移" })).toBeInTheDocument();
  await act(async () => { await i18n.changeLanguage("en"); });
  expect(screen.getByText("Personal")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Data migration" })).toBeInTheDocument();
});

it("has Korean entries for labels stored in navigation and learning data modules", () => {
  // The literal-t() audit cannot see these keys because views call t(variable).
  const keys = [
    ...SETTINGS_PAGE_GROUPS.map(group => group.label),
    ...SETTINGS_CATEGORIES.flatMap(category => [
      category.label,
      ...(category.blurb ? [category.blurb] : []),
      ...(category.children ?? []).flatMap(page => [page.label, page.blurb]),
    ]),
    ...visibleSettingsPages(access).flatMap(page => [page.label, page.blurb, settingsPageLabel(page.key, page.label)]),
    ...[...DASHBOARD_GROUPS, ...PERSONALIZATION_GROUPS].flatMap(group => [
      group.label,
      ...group.items.flatMap(item => [item.title, item.blurb, ...(item.unit ? [item.unit] : [])]),
    ]),
    ...Object.values(NEXT_LABELS),
    ...Object.values(NEXT_CTA_LABELS),
    TEACH_FIRST_PROFILE_LABEL,
  ];
  const catalog = ko as Record<string, string>;
  expect([...new Set(keys)].filter(key => !catalog[key])).toEqual([]);
});
