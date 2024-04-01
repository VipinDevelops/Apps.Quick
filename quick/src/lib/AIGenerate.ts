import { IHttp, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { GetAI } from "../persistance/askai";
import { SettingEnum } from "../settings/settings";
export async function generateAiReply(read: IRead, http: IHttp, text: string): Promise<any> {
    try {
        const aiModel = await GetAI(read);
        const formattedMessage = formatMessage(aiModel.message, text);
        const apiKey = await getApiKey(read);
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;
        const response = await http.post(url, {
            data: {
                contents: [{
                    parts: [{ text: formattedMessage }],
                }],
            },
        });
        return response;
    } catch (error) {
        console.log("Error generating AI reply:", error);
        throw error;
    }
}

async function getApiKey(read: IRead): Promise<string> {
    try {
        const apiKey = await read.getEnvironmentReader().getSettings().getValueById(SettingEnum.AI_API_KEY) as string;
        return apiKey;
    } catch (error) {
        console.log("Error retrieving API key:", error);
        throw error;
    }
}

function formatMessage(originalMessage: string, replyText: string): string {
    return `You need to generate a reply for this message "${originalMessage}" keeping it two or three lines long it should be good message, short .You write professionally.Reply with "${replyText}". `;
}
