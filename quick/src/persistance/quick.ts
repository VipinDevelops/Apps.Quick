import {
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { IMessageReportContext } from "@rocket.chat/apps-engine/definition/messages";
import {
    RocketChatAssociationModel,
    RocketChatAssociationRecord,
} from "@rocket.chat/apps-engine/definition/metadata";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { IReply } from "../../definitions/reply";

const assoc = new RocketChatAssociationRecord(
    RocketChatAssociationModel.MISC,
    "reply"
);
function generateUniqueID(): string {
    // Concatenate current timestamp with a random string to generate a unique ID.
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}
export async function CreateReply(
    read: IRead,
    persistence: IPersistence,
    user: IUser,
    name: string,
    body: string
): Promise<void> {
    let Allreplyobj = await getAllReply(read);
    if (!Allreplyobj) {
        // If there are no replies for any user yet, create a new entry.
        await persistence.createWithAssociation(
            [
                {
                    userId: user.id,
                    replies: [{ id: generateUniqueID(),name: name, body: body }],
                },
            ],
            assoc
        );
    } else {
        // Check if the user already has replies.
        let userRepliesIndex = Allreplyobj.findIndex(reply => reply.userId === user.id);
        if (userRepliesIndex !== -1) {
            // If the user already has replies, push the new reply to their existing list.
            Allreplyobj[userRepliesIndex].replies.push({ id:generateUniqueID(),name: name, body: body });
        } else {
            // If the user doesn't have any replies yet, create a new entry for them.
            Allreplyobj.push({
                userId: user.id,
                replies: [{ id:generateUniqueID(),name: name, body: body }],
            });
        }
        // Update the persistence with the modified Allreplyobj.
        await persistence.updateByAssociation(assoc, Allreplyobj);
    }
}

export async function UpdateReplyPersis(
    read: IRead,
    persistence: IPersistence,
    user: IUser,
    oldId: string,
    newName: string,
    newBody: string
): Promise<void> {
    let Allreplyobj = await getAllReply(read);
    if (!Allreplyobj) {
        // If there are no replies for any user yet, there's nothing to update.
        return;
    } else {
        // Find the user's replies.
        let userRepliesIndex = Allreplyobj.findIndex(reply => reply.userId === user.id);
        if (userRepliesIndex !== -1) {
            // If the user has replies, find the reply with the old ID.
            console.log("oldId", oldId,newName,newBody);
            let replyToUpdate = Allreplyobj[userRepliesIndex].replies.find(reply => reply.id === oldId);
            if (replyToUpdate) {
                // If the reply is found, update its name and body.
                replyToUpdate.name = newName;
                replyToUpdate.body = newBody;
            }
        }
        // Update the persistence with the modified Allreplyobj.
        await persistence.updateByAssociation(assoc, Allreplyobj);
    }
}

export async function getAllReply(
    read: IRead
): Promise<IReply[] | undefined> {
    const data = await read.getPersistenceReader().readByAssociation(assoc);
    return data[0] as IReply[];
}
export async function getUserReply(
    read: IRead,
    user: IUser
): Promise<IReply | undefined> {
    const allreply = await getAllReply(read);
    if (allreply) {
        let reply = allreply.find(
            (reply) => reply.userId === user.id
        ) as IReply;
        return reply;
    }
    return undefined;
}

export async function removeReply(
    read: IRead,
    persistence: IPersistence,
    name: string,
    user: IUser
): Promise<void> {
    let allreply = await getAllReply(read);
    if (allreply) {
        let reply = allreply.find(
            (reply) => reply.userId === user.id
        ) as IReply;
        if (reply) {
            reply.replies = reply.replies.filter(
                (reply) => reply.name !== name
            );
            await persistence.updateByAssociation(assoc, allreply);
        }
    }
}

export async function GetReply(
    read: IRead,
    persistence: IPersistence,
    name: string | undefined,
    user: IUser
): Promise<string | undefined> {
    const userreply = await getUserReply(read, user);

    const replyobject = userreply?.replies.find((obj) => obj.name === name);
    return replyobject?.body;
}
