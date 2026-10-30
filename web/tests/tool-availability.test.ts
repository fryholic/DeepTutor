import test from "node:test";
import assert from "node:assert/strict";

import {
  toolAvailabilityCopy,
  toolEffectiveEnabled,
} from "../lib/tool-availability";

test("configured runtime and saved preference are both required", () => {
  assert.equal(toolEffectiveEnabled(true, true, false), true);
  assert.equal(toolEffectiveEnabled(true, false, false), false);
  assert.equal(toolEffectiveEnabled(false, true, false), false);
  assert.equal(toolEffectiveEnabled(true, true, true), false);
});

test("search provider readiness has actionable copy", () => {
  assert.deepEqual(
    toolAvailabilityCopy("search_provider_not_configured", (key) => key),
    {
      badge: "Not configured",
      detail:
        "Choose a provider in Search settings first. DuckDuckGo needs no API key.",
      href: "/settings#search",
    },
  );
  assert.deepEqual(
    toolAvailabilityCopy("search_provider_not_configured", (key) => `[${key}]`)
      .badge,
    "[Not configured]",
  );
});
