
import { IHttp, IModify, IPersistence, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { sendNotification } from "../../lib/sendNotification";
import { CreateReply } from "../../persistance/quick";
import { QuickApp } from "../../Quick";
import { HandleInvalidReply } from "../HandleInvalidCreate";

export async function createReply(
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
        name, body,
        http,
        app,
        modify,
        user,
        read,
        room
    )

    if (!isValidRepo) {
        return;
    } else {
        await CreateReply(read, persistence, user, name, body);
    }

    await sendNotification(read, modify, user, room, ` A quick Reply ${name} is create for you 👍`)
}
