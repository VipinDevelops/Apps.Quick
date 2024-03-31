import {
    ISetting,
    SettingType,
} from "@rocket.chat/apps-engine/definition/settings";
export enum SettingEnum {
    AI_API_KEY = "ai-api-key",
    PERSONA = "persona-prompt",
}

export const settings: Array<ISetting> = [
    {
        id: SettingEnum.PERSONA,
        type: SettingType.STRING,
        packageValue: "Assume I am a engineer",
        required: true,
        public: false,
        section: "PersonalSettings",
        i18nLabel: "Enter you Persona to change your AI response",
        i18nPlaceholder: "Assume I am a engineer",
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
