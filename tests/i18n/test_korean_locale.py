"""Korean UI locale integration tests."""

from __future__ import annotations

import json
import pathlib
import re

import pytest

from deeptutor.services.config.launch_settings import (
    _normalize_language as _launch_language,
)
from deeptutor.services.config.settings_spec import _LANGUAGE_CHOICES
from deeptutor.services.prompt.language import language_directive, language_label
from deeptutor.services.settings.interface_settings import _normalize_language

WEB = pathlib.Path(__file__).resolve().parents[2] / "web"


def _catalog(locale: str) -> dict[str, str]:
    return json.loads((WEB / f"locales/{locale}/app.json").read_text(encoding="utf-8"))


@pytest.mark.parametrize(
    "raw",
    [
        "ko",
        "KO",
        " ko ",
        "korean",
        "한국어",
        "ko-KR",
        "ko_KR",
    ],
)
def test_normalizer_accepts_korean_spellings(raw: str) -> None:
    assert _normalize_language(raw) == "ko"


def test_launch_settings_accept_korean() -> None:
    assert _launch_language("ko-KR") == "ko"
    assert _launch_language("korean") == "ko"
    assert _launch_language("한국어") == "ko"


def test_settings_offers_korean() -> None:
    assert "ko" in {code for code, _label, _desc in _LANGUAGE_CHOICES}


def test_language_directive_names_korean() -> None:
    assert language_label("ko") == "한국어"
    assert "한국어" in language_directive("ko")


def test_web_locale_matches_english_keys() -> None:
    assert set(_catalog("ko")) == set(_catalog("en"))


def test_web_locale_keeps_interpolation_placeholders() -> None:
    en = _catalog("en")
    ko = _catalog("ko")

    pattern = re.compile(r"\{\{[^}]+\}\}")

    mismatches = [
        key
        for key in set(en) & set(ko)
        if set(pattern.findall(en[key])) != set(pattern.findall(ko[key]))
    ]

    assert mismatches == []


def test_every_locale_can_name_korean() -> None:
    for locale in ("en", "zh", "fr", "de", "uk", "pl", "ko"):
        assert "language.korean" in _catalog(locale)


def test_frontend_registers_korean() -> None:
    languages = (WEB / "i18n/languages.ts").read_text(encoding="utf-8")
    assert '{ code: "ko", labelKey: "language.korean" }' in languages

    init = (WEB / "i18n/init.ts").read_text(encoding="utf-8")
    assert "@/locales/ko/app.json" in init
