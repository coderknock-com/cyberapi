import {defineStore} from "pinia";

export const useDialogStore = defineStore("dialogs", {
    state: () => {
        return {
            showSetting: false,
            showCookie: false,
            showEnvironment: false,
            showStore: false,
            showCustomizeVariableStore: false,
            showReqHeader: false,
        };
    },
    actions: {
        toggleSettingDialog(shown: boolean) {
            this.showSetting = shown;
        },
        toggleCookieDialog(shown: boolean) {
            this.showCookie = shown;
        },
        toggleEnvironmentDialog(shown: boolean) {
            this.showEnvironment = shown;
        },
        toggleStoreDialog(shown: boolean) {
            this.showStore = shown;
        },
        toggleCustomizeVariableDialog(shown: boolean) {
            this.showCustomizeVariableStore = shown;
        },
        toggleReqHeaderDialog(shown: boolean) {
            this.showReqHeader = shown;
        },
    },
});