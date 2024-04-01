import {
    ISetting,
    SettingType,
} from "@rocket.chat/apps-engine/definition/settings";
export enum SettingEnum {
    AI_API_KEY = "ai-api-key",
    API_URL = "API_URL",
}

export const settings: Array<ISetting> = [
    {
        id: SettingEnum.API_URL,
        type: SettingType.STRING,
        packageValue: "",
        required: true,
        public: false,
        section: "PersonalSettings",
        i18nLabel: "Enter Your AI API URL",
        i18nPlaceholder: "Enter your AI API URL",
        hidden: false,
        multiline: false,
    },
    {
        id: SettingEnum.AI_API_KEY,
        type: SettingType.PASSWORD,
        packageValue: "",
        required: true,
        public: false,
        section: "AISettings",
        i18nLabel: "Enter your API key for AI",
        i18nPlaceholder: "API key for AI",
        hidden: false,
        multiline: false,
    },
];
