import { IHttp, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { GetAI } from "../persistance/askai";
import { SettingEnum } from "../settings/settings";
export async function generateAiReply(read: IRead, http: IHttp, text: string): Promise<any> {
    try {
        const aiModel = await GetAI(read);
        const formattedMessage = formatMessage(aiModel.message, text);
        const apiKey = await getApiKey(read);
        const AIurl = await getAIurl(read);
        const url = `${AIurl}?key=${apiKey}`;
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


async function getAIurl(read: IRead): Promise<string> {
    try {
        const URL = await read.getEnvironmentReader().getSettings().getValueById(SettingEnum.API_URL) as string;
        return URL;
    } catch (error) {
        console.log("Error retrieving API key:", error);
        throw error;
    }
}
function formatMessage(originalMessage: string, replyText: string): string {
    return `You need to generate a reply for this message " ${originalMessage} " while maintaining good grammar and concise yet well-written content. Please ensure professionalism in your writing as your output will be shown to the user. Reply with " ${replyText} " `
}
