import { IRead, IPersistence, IHttp, IModify } from "@rocket.chat/apps-engine/definition/accessors";
import { QuickApp } from "../Quick";
import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { CreateTemplateModal } from "../modal/CreateModal";
export async function CreateTemplate(
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
        const modal = await CreateTemplateModal({
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
