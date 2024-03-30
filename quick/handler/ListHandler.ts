
import { IRead, IPersistence, IHttp, IModify } from "@rocket.chat/apps-engine/definition/accessors";
import { QuickApp } from "../Quick";
import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { CreateReplyModal } from "../modal/CreateModal";
import { ReplyModal } from "../modal/ReplyModal";
export async function ListHandler(
    read: IRead,
    context: SlashCommandContext,
    app: QuickApp,
    persistence: IPersistence,
    http: IHttp,
    room: IRoom,
    modify: IModify
) {
    const triggerId = context.getTriggerId();
    if (triggerId) {
        const modal = await ReplyModal({
            modify: modify,
            read: read,
            persistence: persistence,
            http: http,
            slashcommandcontext: context,
        });
        await modify
            .getUiController()
            .openModalView(
                modal,
                { triggerId },
                context.getSender()
            );
    } else {
        console.log("invalid Trigger ID !");
    }
}
