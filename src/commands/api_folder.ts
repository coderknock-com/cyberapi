import dayjs from "dayjs";
import {ulid} from "ulid";

import {isWebMode} from "../helpers/util";
import {cmdAddAPIFolder, cmdDeleteAPIFolder, cmdListAPIFolder, cmdUpdateAPIFolder, run,} from "./invoke";
import {fakeAdd, fakeDeleteItems, fakeList, fakeUpdate} from "./fake";

const store = "apiFolders";

export interface APIFolder {
    id: string;
    collection: string;
    children: string;
    // 名称
    name: string;
    // 创建时间
    createdAt: string;
    // 更新时间
    updatedAt: string;

    [key: string]: unknown;
}

export function newDefaultAPIFolder(): APIFolder {
    const id = ulid();
    return {
        id,
        collection: "",
        children: "",
        name: "",
        createdAt: dayjs().format(),
        updatedAt: dayjs().format(),
    };
}

export async function createAPIFolder(folder: APIFolder): Promise<void> {
    if (isWebMode()) {
        await fakeAdd<APIFolder>(store, folder);
        return;
    }
    await run(cmdAddAPIFolder, {
        folder,
    });
}

export async function listAPIFolder(collection: string): Promise<APIFolder[]> {
    if (isWebMode()) {
        const folders = await fakeList<APIFolder>(store);
        return folders.filter((item) => item.collection === collection);
    }
    return await run<APIFolder[]>(cmdListAPIFolder, {
        collection,
    });
}

export async function updateAPIFolder(folder: APIFolder) {
    if (isWebMode()) {
        return await fakeUpdate(store, folder);
    }
    await run(cmdUpdateAPIFolder, {
        folder,
    });
}

export async function deleteAPIFolder(id: string): Promise<{
    folders: string[];
    settings: string[];
}> {
    const result = {
        folders: [] as string[],
        settings: [] as string[],
    };
    if (isWebMode()) {
        // 查询folders
        const folders = await listAPIFolder("");
        const folderDict: Map<string, APIFolder> = new Map();
        folders.forEach((item) => {
            folderDict.set(item.id, item);
        });
        if (!folderDict.has(id)) {
            return Promise.resolve(result);
        }
        const folderIds = [id];
        const settingIds: string[] = [];
        let children = folderDict.get(id)?.children;
        while (children) {
            const subChildren: string[] = [];
            const arr = children.split(",");
            arr.forEach((id) => {
                if (!id) {
                    return;
                }
                if (settingIds.includes(id) || folderIds.includes(id)) {
                    return;
                }
                const folder = folderDict.get(id);
                if (folder) {
                    folderIds.push(id);
                    if (folder.children) {
                        subChildren.push(folder.children);
                    }
                } else {
                    settingIds.push(id);
                }
            });
            children = subChildren.join(",");
        }
        await fakeDeleteItems("apiSettings", settingIds);
        await fakeDeleteItems(store, folderIds);
        result.folders = folderIds;
        result.settings = settingIds;
        return result;
    }
    return await run(cmdDeleteAPIFolder, {
        id,
    });
}