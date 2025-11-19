import { Notice, normalizePath } from 'obsidian';
const { moment } = require('obsidian');

import type {
    HNItem,
} from "src/integrations/types";

import type HackerNewsPlugin from "src/main";

export default class APIManager {
    plugin: HackerNewsPlugin;

    constructor(plugin: HackerNewsPlugin) {
        this.plugin = plugin;
    }

    public async requestTopStories(): Promise<HNItem[]> {
        let itemIds = await this.requestTopStoriesIds();

        const stories: HNItem[] = [];
        for (const itemId of itemIds) {
            try {
                const story = await this.requestStoryById(itemId);
                stories.push(story);
                if (stories.length >= this.plugin.settings.numberOfStories) {
                    break;
                }
            } catch (error) {
                console.error(`Failed to fetch details for item ID ${itemId}:`, error);
            }
        }

        return stories;
    }

    async requestTopStoriesIds(): Promise<number[]> {
        try {
            const url = "https://hacker-news.firebaseio.com/v0/topstories.json";
            const response = await fetch(url);
            const itemIds = await response.json() as number[];
            return itemIds;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async requestStoryById(itemId: Number): Promise<HNItem> {
        const itemResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${itemId}.json?print=pretty`);
        const hnItem = (await itemResponse.json()) as HNItem

        return hnItem;
    }

    public async saveHNItem(hnItem: HNItem) {
        const dir = this.plugin.settings.storiesFolder
        const title = hnItem.title.replace(/[\/\\\:]/g, ' ')
        const filePath = normalizePath([dir, `${title}.md`].join('/'))

        const vault = this.plugin.app.vault;

        let stat = await vault.adapter.stat(dir)
        if (!stat) {
            await vault.createFolder(dir)
        }

        stat = await vault.adapter.stat(filePath)
        if (!stat) {
            await vault.create(filePath, this.getStoryFileContent(hnItem))
            new Notice(`Story saved: ${hnItem.title}`)
        } else {
            new Notice("Story already saved")
        }
    }

    getStoryFileContent(hnItem: HNItem): string {
        let data = this.plugin.settings.storyTemplate;
        return data.replace(/{{title}}/g, hnItem.title)
            .replace(/{{url}}/g, hnItem.url)
            .replace(/{{date}}/g, moment().format('LLLL'))
    }
}
