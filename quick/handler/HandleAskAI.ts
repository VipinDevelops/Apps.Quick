
import { IRead, IPersistence, IHttp, IModify } from "@rocket.chat/apps-engine/definition/accessors";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { SearchModal } from "../modal/SearchModal";
import { QuickApp } from "../Quick";

export async function handleSearch(
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
        const modal = await SearchModal({
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
