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
        id: "which-ai-credentials", // workspace or personal
        type: SettingType.SELECT,
        values:[{key: "workspace", i18nLabel: "Workspace"}, {key: "personal", i18nLabel: "Personal"}],
        packageValue: "",
        required: true,
        public: false,
        section: "PersonalSettings",
        i18nLabel: "Which AI credentials do you want to use?",
        hidden: false,
    },
    {
        id: "which-ai-are you using", // open ai or google gemeni ai or mistral ai
        type: SettingType.SELECT,
        values:[{key: "open-ai", i18nLabel: "Open AI"}, {key: "google-gemeni-ai", i18nLabel: "Google Gemeni AI"}, {key: "mistral-ai", i18nLabel: "Mistral AI"}],
        packageValue: "",
        required: true,
        public: false,
        section: "PersonalSettings",
        i18nLabel: "Which AI are you using?",
        hidden: false,
    },
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
