import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { getOrCreateDirectRoom } from "../helper/getOrCreateDirectRoom";
import { BlockBuilder } from "./BlockBuilder";
import { Messages, OnInstallContent } from "../enum/message";
import { IMessageAttachment } from "@rocket.chat/apps-engine/definition/messages";

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
            console.log(recevier.name, user.name)
            text = replaceUsername(text, recevier.name);
            text = replaceYourname(text, user.name)
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
    const regex = /\[\s*username\s*\]/g;

    console.log("regex")
    // Replace the pattern with the provided replacement
    return messagestring.replace(regex, replacement);
}

function replaceYourname(messagestring: string, replacement: string) {
    // Regular expression to match {{username}} pattern
    const regex = /\[\s*myname\s*\]/g;

    console.log("myname reg")
    // Replace the pattern with the provided replacement
    return messagestring.replace(regex, replacement);
}

export async function sendHelperMessageOnInstall(
    appId: string,
    user: IUser,
    read: IRead,
    modify: IModify,
    http?: IHttp,
    persistence?: IPersistence
): Promise<void> {
    const appUser = (await read.getUserReader().getAppUser()) as IUser;
    const members = [user.username, appUser.username];

    const room = await getOrCreateDirectRoom(read, modify, members);
    const blockBuilder = new BlockBuilder(appId);
    const title = [OnInstallContent.PREVIEW_TITLE.toString()];
    const description = [OnInstallContent.PREVIEW_DESCRIPTION.toString()];
  

    const installationPreview = blockBuilder.createPreviewBlock({
        title,
        description,
    });
    const text = `Hey **${user.username}** ! ${OnInstallContent.WELCOME_TEXT.toString()} ${OnInstallContent.WELCOMING_MESSAGE.toString()}`;

    const previewBuilder = modify
        .getCreator()
        .startMessage()
        .setRoom(room)
        .setSender(appUser)
        .setGroupable(false)
        .setBlocks([installationPreview])
        .setParseUrls(true);

    const textMessageBuilder = modify
        .getCreator()
        .startMessage()
        .setRoom(room)
        .setSender(appUser)
        .setGroupable(true)
        .setParseUrls(false)
        .setText(text);

    await modify.getCreator().finish(previewBuilder);
    await modify.getCreator().finish(textMessageBuilder);
}

export async function sendHelperNotification(
    read: IRead,
    modify: IModify,
    user: IUser,
    room: IRoom
): Promise<void> {
    const appUser = (await read.getUserReader().getAppUser()) as IUser;
    const attachment: IMessageAttachment = {
        color: "#000000",
        text: Messages.HELPER_COMMANDS,
    };

    const helperMessage = modify
        .getCreator()
        .startMessage()
        .setRoom(room)
        .setSender(appUser)
        .setText(Messages.HELPER_TEXT)
        .setAttachments([attachment])
        .setGroupable(false);

    return read.getNotifier().notifyUser(user, helperMessage.getMessage());
}