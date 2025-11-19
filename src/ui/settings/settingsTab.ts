import type HackerNewsPlugin from "src/main";

import { App, PluginSettingTab, Setting } from "obsidian";
import t from "src/l10n/helpers";
import { DEFAULT_SETTINGS } from "src/_constants";

export default class SettingsTab extends PluginSettingTab {
    plugin: HackerNewsPlugin;

    constructor(app: App, plugin: HackerNewsPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl, plugin } = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName(t('setting-number-of-stories'))
            .setDesc(t('setting-number-of-stories-desc'))
            .addText(text => text
                .setPlaceholder(DEFAULT_SETTINGS.numberOfStories.toString())
                .setValue(plugin.settings.numberOfStories.toString())
                .onChange(async (value) => {
                    let numberOfStories = parseInt(value)
                    if (Number.isNaN(numberOfStories) || numberOfStories <= 0 || numberOfStories > 10) {
                        numberOfStories = DEFAULT_SETTINGS.numberOfStories;
                    }
                    plugin.settings.numberOfStories = numberOfStories;
                    await this.save();
                }));

        new Setting(containerEl)
            .setName(t('setting-refresh-interval'))
            .setDesc(t('setting-refresh-interval-desc'))
            .addText(text => text
                .setPlaceholder(DEFAULT_SETTINGS.refreshInterval.toString())
                .setValue(plugin.settings.refreshInterval.toString())
                .onChange(async (value) => {
                    let refreshInterval = parseInt(value)
                    if (Number.isNaN(refreshInterval) || refreshInterval <= 0) { refreshInterval = DEFAULT_SETTINGS.refreshInterval; }
                    plugin.settings.refreshInterval = refreshInterval;
                    await this.save();
                }));

        new Setting(containerEl)
            .setName(t('setting-stories-folder'))
            .setDesc(t('setting-stories-folder-desc'))
            .addText(text => text
                .setPlaceholder(DEFAULT_SETTINGS.storiesFolder)
                .setValue(plugin.settings.storiesFolder)
                .onChange(async (value) => {
                    plugin.settings.storiesFolder = value;
                    await this.save();
                }));

        new Setting(containerEl)
            .setName(t('setting-story-template'))
            .setDesc(t('setting-story-template-desc'))
            .addTextArea(text => text
                .setPlaceholder('stories folder')
                .setValue(plugin.settings.storyTemplate)
                .onChange(async (value) => {
                    plugin.settings.storyTemplate = value;
                    await this.save();
                }));
    }

    private async save() {
        await this.plugin.saveSettings();
    }
}
