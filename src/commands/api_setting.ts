import dayjs from "dayjs";
import {ulid} from "ulid";

import {isWebMode} from "../helpers/util";
import {cmdAddAPISetting, cmdDeleteAPISettings, cmdListAPISetting, cmdUpdateAPISetting, run,} from "./invoke";
import {fakeAdd, fakeList, fakeUpdate, fakeUpdateStore} from "./fake";

const store = "apiSettings";

export interface APISetting {
    id: string;
    collection: string;
    // 名称
    name: string;
    // 类型(http, graphQL)
    category: string;
    // 配置信息
    setting: string;
    // 创建时间
    createdAt: string;
    // 更新时间
    updatedAt: string;

    [key: string]: unknown;
}

export function newDefaultAPISetting(): APISetting {
    const id = ulid();
    return {
        id,
        collection: "",
        name: "",
        category: "",
        setting: "",
        createdAt: dayjs().format(),
        updatedAt: dayjs().format(),
    };
}

export async function createAPISetting(setting: APISetting): Promise<void> {
    if (isWebMode()) {
        await fakeAdd<APISetting>(store, setting);
        return;
    }
    await run(cmdAddAPISetting, {
        setting,
    });
}

export async function listAPISetting(
    collection: string
): Promise<APISetting[]> {
    if (isWebMode()) {
        const settings = await fakeList<APISetting>(store);
        return settings.filter((item) => item.collection === collection);
    }
    return await run<APISetting[]>(cmdListAPISetting, {
        collection,
    });
}

export async function updateAPISetting(setting: APISetting) {
    if (isWebMode()) {
        await fakeUpdate(store, setting);
        return;
    }
    await run(cmdUpdateAPISetting, {
        setting,
    });
}

export async function deleteAPISettings(ids: string[]) {
    if (isWebMode()) {
        const arr = await fakeList<APISetting>(store);
        const result = arr.filter((item) => {
            return !ids.includes(item.id);
        });
        await fakeUpdateStore(store, result);
    }
    await run(cmdDeleteAPISettings, {
        ids,
    });
}