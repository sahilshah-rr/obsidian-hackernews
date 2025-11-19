import type { HackerNewsSettings } from "src/types";
import t from 'src/l10n/helpers';

export const VIEW_TYPE = 'hackernews-view';
export const VIEW_DISPLAY_TEXT = t('view-title');
export const VIEW_ICON = 'hackernews';

export const LANGUAGES = {
    "en_US": "English (US)",
}

export const RFC = {
    "en_US": "en-US",
}

export const DEFAULT_SETTINGS: Partial<HackerNewsSettings> = {
    numberOfStories: 5,
    refreshInterval: 60,
    storiesFolder: "HackerNews",
    storyTemplate: `---
date: {{date}}
source: {{url}}

---

# {{title}}

> notes from [{{title}}]({{url}})
`
}
