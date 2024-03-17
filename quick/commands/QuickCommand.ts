import { IRead, IModify, IHttp, IPersistence, } from "@rocket.chat/apps-engine/definition/accessors";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { ISlashCommand, ISlashCommandPreview, ISlashCommandPreviewItem, SlashCommandContext, SlashCommandPreviewItemType } from "@rocket.chat/apps-engine/definition/slashcommands";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { CommandUtility } from "../lib/commandUtility";
import { getAllReminders } from "../persistance/quick";
import { QuickApp } from "../Quick";

export class QuickCommand implements ISlashCommand {
    public constructor(private readonly app: QuickApp) { }
    public command = 'quick'
    public i18nDescription = "cmd_description";
    public providesPreview = true;
    public i18nParamsExample = "";

    // public async executor(
    //     context: SlashCommandContext,
    //     read: IRead,
    //     modify: IModify,
    //     http: IHttp,
    //     persistence: IPersistence
    // ): Promise<void> {
    //
    //     const command = context.getArguments();
    //     const user: IUser = context.getSender() //User who sent the message
    //     const bot: IUser = (await read.getUserReader().getAppUser()) as IUser //bot user
    //     const room: IRoom = context.getRoom()
    //
    //     if (!Array.isArray(command)) {
    //         return;
    //     }
    //
    //     const roommessage = await read.getRoomReader().getMessages(room.id);
    //     console.log(roommessage);
    //
    //     const commandUtility = new CommandUtility(
    //         {
    //             user: user,
    //             room: room,
    //             command: command,
    //             bot: bot,
    //             context: context,
    //             read: read,
    //             modify: modify,
    //             http: http,
    //             persistence: persistence,
    //             app: this.app
    //         }
    //     );
    //
    //     commandUtility.resolveCommand();
    // }
    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
        console.log("executor")
        return;
    }
    // public async previewer(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<ISlashCommandPreview> {
    //     console.log(context, "preview")
    //     const getreply = getAllReminders(read);
    //     let items: Array<ISlashCommandPreviewItem> = [{ id: "1", type: SlashCommandPreviewItemType.TEXT, value: "test" }]
    //
    //
    //     return { i18nTitle: "Short Command", items }
    // }
    // public async executePreviewItem(item: ISlashCommandPreviewItem, context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
    //     modify.getExtender()
    //     console.log(context);
    // }
}
