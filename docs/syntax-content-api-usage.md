# Quran Foundation Content APIs — Syntax feature file changes

This document answers which **Quran Foundation Content APIs** appear in the **§8 file change list** from [`syntax-study-mode-design.md`](./syntax-study-mode-design.md), and how they relate to the Syntax / Study Mode work.

**Baseline reference:** `git diff origin/production...HEAD` (see design doc §8).

---

## Short answer

**No Quran Foundation Content API was added for Syntax morphology or charts.**

Syntax-specific files only call **`POST /api/syntax/analyze`** → **Quran MCP** (see design doc §3–4).

Among the **changed files in §8**, Content is used only where **existing Study Mode** already loaded verse/word data or tab counts—not for the new Syntax analysis pipeline.

---

## Syntax-only files (§8) — no Content API

These paths do **not** use `makeUrl` / `getProxiedServiceUrl(QuranFoundationService.CONTENT, …)`:

| Files | What they call instead |
|--------|-------------------------|
| `src/pages/api/syntax/analyze.ts` | Server → Quran MCP |
| `src/lib/syntaxAnalysisQuranMcp*.ts`, `syntaxChartsFromMcp.ts`, `syntaxAnalysisCharts.ts` | Quran MCP tools only |
| `src/services/syntaxAnalysisService.ts` | Same-origin `POST /api/syntax/analyze` |
| `src/services/syntaxAnalysis.mock.ts` | Local mock |
| `types/SyntaxAnalysis.ts` | Types only |
| `SyntaxView/*` | SWR → `/api/syntax/analyze`; word text from props (`selectedWord`) |
| `StudyModeSyntaxTab.tsx` | UI shell only |
| `StudyModeBottomActions/index.tsx` | Tab id enum only |

This matches the design doc diagram (§9): Browser → SyntaxBody → `/api/syntax/analyze` → MCP, with **no** `/api/proxy/content/...` step.

---

## Modified Study Mode files — indirect Content API (pre-existing)

### 1. `StudyModeModal/index.tsx` (M)

**Content API used (existing Study Mode verse fetch):**

| Endpoint | Helper | Purpose for Syntax |
|----------|--------|-------------------|
| **`GET /api/v4/verses/by_key/{verseKey}`** | `makeByVerseKeyUrl` in `src/utils/apiPaths.ts` → `makeUrl` → `/api/proxy/content/api/v4/verses/by_key/...` | Loads verse + **words** (Uthmani, location, etc.). Syntax reads `selectedWord` from that data; it does **not** fetch morphology from Content. |

Query params on that call include `words`, translations, mushaf/word fields, etc. (same SWR block as before Syntax).

### 2. `StudyModeBodyTabs.tsx` (M)

Registers the Syntax tab but also keeps **batched count** hooks for **other** tabs. Those hit Content **only for tab visibility**, not for Syntax analysis:

| Content API (via `makeUrl`) | Hook | Used for tab |
|-----------------------------|------|----------------|
| **`GET /api/v4/qiraat/matrix/count_within_range`** | `useBatchedCountRangeQiraat` | Qiraat |
| **`GET /api/v4/layered_translations/count_within_range`** | `useBatchedCountRangeLayeredTranslations` | Layers |
| **`GET /api/v4/hadith_references/count_within_range`** | `useBatchedCountRangeHadiths` | Hadith |

**Questions** counts use the **Auth** service (`makeCountQuestionsWithinRangeUrl` in `utils/auth/apiPaths`), not Content.

The **Syntax** tab has `condition: true` and does **not** depend on any of these count endpoints.

### 3. Other modified files in §8

| File | Content API? |
|------|----------------|
| `StudyModeBody.tsx` | No — layout / tab panel wiring |
| `StudyModeBottomActions/index.tsx` | No |
| `.env.example`, `package.json`, `yarn.lock`, `tsconfig.json` | No |
| `VerseText.module.scss` | No |

---

## Not in §8 but related

`BottomActions.tsx` (Syntax next to Tafsir on the main reading page) also does **not** call Content for Syntax; it only `openStudyMode({ activeTab: SYNTAX })`. Tafsir still uses existing tafsir URLs; other tabs use the same batched count pattern as Study Mode.

`src/utils/url.ts` is documented in the design doc §7.2 as **unchanged vs production** and is **not** used by the Syntax feature.

---

## Summary table (Content APIs vs §8 file list)

| Quran Foundation Content API | Used by Syntax feature? | File in §8 change list |
|------------------------------|-------------------------|-------------------------|
| `POST /api/syntax/analyze` (app) + **Quran MCP** | **Yes** (only Syntax data source) | New syntax files + `analyze.ts` |
| `GET /verses/by_key/{verseKey}` | Indirectly (word/verse UI) | `StudyModeModal/index.tsx` |
| `GET /qiraat/matrix/count_within_range` | No (other tabs) | `StudyModeBodyTabs.tsx` |
| `GET /layered_translations/count_within_range` | No (other tabs) | `StudyModeBodyTabs.tsx` |
| `GET /hadith_references/count_within_range` | No (other tabs) | `StudyModeBodyTabs.tsx` |

For the **Syntax feature itself**: **none** of the Content APIs in §8 were introduced for grammar analysis; only **`/verses/by_key/...`** in the modified Study Mode modal supplies the word object Syntax displays and sends to MCP as `textUthmani` / `verseKey`.

---

## Related documentation

- [Syntax analysis & Study Mode — design notes](./syntax-study-mode-design.md)
- [Quran MCP documentation](https://mcp.quran.ai/documentation)
