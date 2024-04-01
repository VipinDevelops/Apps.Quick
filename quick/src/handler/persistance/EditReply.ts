
import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { sendNotification } from "../../lib/sendNotification";
import { CreateReply,  UpdateReplyPersis,  } from "../../persistance/quick";
import { HandleInvalidReply } from "../HandleInvalidCreate";
import { QuickApp } from "../../../Quick";
import { clearId, getId } from "../../persistance/saveid";

export async function EditReplyHandler(
    name: string,
    body: string,
    room: IRoom,
    read: IRead,
    app: QuickApp,
    persistence: IPersistence,
    modify: IModify,
    http: IHttp,
    user: IUser
) {
    const isValidRepo = await HandleInvalidReply(
        name,
        body,
        http,
        app,
        modify,
        user,
        read,
        room
    );

    if (!isValidRepo) {
        return;
    } else {
        let id = await getId(read.getPersistenceReader());
        
        console.log("id", id);
        await UpdateReplyPersis(read, persistence, user,id.id, name, body);
        await clearId(persistence)
    }

    await sendNotification(
        read,
        modify,
        user,
        room,
        `A quick Reply *${name}* is edited for 👍`
    );
}
