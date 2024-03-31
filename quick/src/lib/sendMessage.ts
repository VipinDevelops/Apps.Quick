import {
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { IUser } from "@rocket.chat/apps-engine/definition/users";

export async function sendMessage(
    modify: IModify,
    user: IUser,
    room: IRoom,
    message: string,
    threadId?: string,
    // attachment?: IMessageAttachment
): Promise<void> {
    // console.log(threadId);
    const messageBuilder = modify
        .getCreator()
        .startMessage()
        .setSender(user)
        .setRoom(room)
        .setGroupable(false)
        .setParseUrls(true);

    if (message) {
        messageBuilder.setText(message);
    }

    if (threadId) {
        messageBuilder.setThreadId(threadId);
    }

    await modify.getCreator().finish(messageBuilder);
    return;
}

export async function sendUniqueMessage(
    read: IRead,
    modify: IModify,
    user: IUser,
    room: IRoom,
    message: string,
    threadId?: string,
    // attachment?: IMessageAttachment
): Promise<void> {
    console.log(room.userIds);
    console.log(user);
    // {{username}}
    let text = message;


    if (room.userIds?.length === 2) {
        let senderid = user.id;
        let otherUserId = room.userIds.find(userId => userId !== senderid);
        console.log(otherUserId, "other id ")
        if (otherUserId) {
            const recevier = await read.getUserReader().getById(otherUserId)
            text = replaceUsername(text, recevier.username);
        }

    }

    const messageBuilder = modify
        .getCreator()
        .startMessage()
        .setSender(user)
        .setRoom(room)
        .setGroupable(false)
        .setParseUrls(true);

    if (message) {
        messageBuilder.setText(text);
    }

    if (threadId) {
        messageBuilder.setThreadId(threadId);
    }

    await modify.getCreator().finish(messageBuilder);
    return;
}

function replaceUsername(messagestring: string, replacement: string) {
    // Regular expression to match {{username}} pattern
    const regex = /{{\s*username\s*}}/g;

    console.log("regex")
    // Replace the pattern with the provided replacement
    return messagestring.replace(regex, replacement);
}
