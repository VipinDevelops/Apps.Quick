
import {
    IHttp,
    IModify,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { IAuthData } from "@rocket.chat/apps-engine/definition/oauth2/IOAuth2";
import { QuickApp } from "../Quick";

export async function HandleInvalidReply(
    name: string,
    body: string,
    http: IHttp,
    app: QuickApp,
    modify: IModify,
    sender: IUser,
    read: IRead,
    room: IRoom
): Promise<boolean> {

    const isValidReplyname: boolean = name !== undefined && name !== null && name !== "";
    const isValidReplybody: boolean = body !== undefined && body !== null && body !== "";

    if (!isValidReplybody || !isValidReplyname) {
        const warningBuilder = await modify
            .getCreator()
            .startMessage()
            .setRoom(room);

        if (!isValidReplyname) {
            warningBuilder.setText(
                `Hey ${sender.username}! Provided A proper name to quick Reply you create.`
            );
        } else {
            warningBuilder.setText(
                `Hey ${sender.username}! Provided A proper message for your quick reply.`
            );
        }

        if (room.type !== "l") {
            await modify
                .getNotifier()
                .notifyUser(sender, warningBuilder.getMessage());
        } else {
            await modify.getCreator().finish(warningBuilder);
        }
    }

    return isValidReplyname && isValidReplybody;
}
