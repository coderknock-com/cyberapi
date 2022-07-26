import { invoke, InvokeArgs } from "@tauri-apps/api/tauri";
import Debug from "debug";
import { isWebMode } from "../helpers/util";

export const cmdAddAPISetting = "add_api_setting";
export const cmdListAPISetting = "list_api_setting";
export const cmdUpdateAPISetting = "update_api_setting";
export const cmdDeleteAPISettings = "delete_api_settings";

export const cmdAddAPIFolder = "add_api_folder";
export const cmdListAPIFolder = "list_api_folder";
export const cmdUpdateAPIFolder = "update_api_folder";
export const cmdDeleteAPIFolder = "delete_api_folder";

export const cmdAddAPICollection = "add_api_collection";
export const cmdUpdateAPICollection = "update_api_collection";
export const cmdListAPICollection = "list_api_collection";
export const cmdDeleteAPICollection = "delete_api_collection";

export const cmdDoHTTPRequest = "do_http_request";

export const cmdListCookie = "list_cookie";
export const cmdDeleteCookie = "delete_cookie";
export const cmdAddCookie = "add_cookie";

const debug = Debug("invoke");
export async function run<T>(cmd: string, args?: InvokeArgs): Promise<T> {
  if (isWebMode()) {
    debug("invoke, cmd:%s, args:%o", cmd, args);
    // eslint-disable-next-line
    // @ts-ignore: mock
    return Promise.resolve(null);
  }
  try {
    return await invoke<T>(cmd, args);
  } catch (err) {
    // eslint-disable-next-line
    // @ts-ignore: mock
    const message = `[${err.category}]${err.message}`;
    throw new Error(message);
  }
}
