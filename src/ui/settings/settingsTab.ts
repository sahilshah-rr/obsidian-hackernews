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
            .setName(t('Refresh Interval'))
            .setDesc(t('The time interval in seconds after which the next top story will be fetched. Default and invalid values will be reverted to 60 seconds.'))
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
            .setName(t('Stories Folder'))
            .setDesc(t('The folder that holds the saved HackerNews stories. The folder will be created if it does not exist.'))
            .addText(text => text
                .setPlaceholder(DEFAULT_SETTINGS.storiesFolder)
                .setValue(plugin.settings.storiesFolder)
                .onChange(async (value) => {
                    plugin.settings.storiesFolder = value;
                    await this.save();
                }));

        new Setting(containerEl)
            .setName(t('Story Template'))
            .setDesc(t('Specify how the HackerNews story is saved; available attributes: title, url, date.'))
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
