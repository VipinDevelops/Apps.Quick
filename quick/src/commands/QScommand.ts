
import {
    IRead,
    IModify,
    IHttp,
    IPersistence,
} from "@rocket.chat/apps-engine/definition/accessors";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import {
    ISlashCommand,
    ISlashCommandPreview,
    ISlashCommandPreviewItem,
    SlashCommandContext,
    SlashCommandPreviewItemType,
} from "@rocket.chat/apps-engine/definition/slashcommands";
import { QuickApp } from "../../Quick";
import { getUserReply } from "../persistance/quick";
import { sendMessage, sendUniqueMessage } from "../lib/sendMessage";
import { IReply } from "../../definitions/reply";

export class QuickSendCommand implements ISlashCommand {
    public constructor(private readonly app: QuickApp) { }
    public command = "qs";
    public i18nDescription = "cmd_qs_description";
    public providesPreview = true;
    public i18nParamsExample = "";

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persistence: IPersistence
    ): Promise<void> {
        //     console.log("executor")
    }
    // public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> { console.log("executor")
    //     return;
    // }
    public async previewer(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<ISlashCommandPreview> {
        const items: Array<ISlashCommandPreviewItem> = [];
        const command = context.getArguments();
        const user = context.getSender();
        const userReply: IReply | undefined = await getUserReply(read, user);

        if (!userReply) {
            return { i18nTitle: "No Replies", items: [] };
        }

        const matchReply = userReply.replies.filter(reply => reply.name.toLowerCase().includes(command[0].toLowerCase()));
        matchReply.forEach(reply => items.push({ id: items.length.toString(), type: SlashCommandPreviewItemType.TEXT, value: `${reply.name}: ${reply.body}`.slice(0, 40) }));

        return { i18nTitle: "Short Command", items };
    }

    public async executePreviewItem(item: ISlashCommandPreviewItem, context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
        const value = item.value;
        const name = value.split(":")[0].trim();
        const user = context.getSender();
        const room = context.getRoom();
        const userReply = await getUserReply(read, user);
        const body = userReply?.replies.find(reply => reply.name.toLowerCase() === name.toLowerCase())?.body;

        if (body) {
            await sendUniqueMessage(read, modify, user, room, body);
        }
    }
}
