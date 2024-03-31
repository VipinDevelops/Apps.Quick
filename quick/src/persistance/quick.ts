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
                    replies: [{ name: name, body: body }],
                },
            ],
            assoc
        );
    } else {
        // Check if the user already has replies.
        let userRepliesIndex = Allreplyobj.findIndex(reply => reply.userId === user.id);
        if (userRepliesIndex !== -1) {
            // If the user already has replies, push the new reply to their existing list.
            Allreplyobj[userRepliesIndex].replies.push({ name: name, body: body });
        } else {
            // If the user doesn't have any replies yet, create a new entry for them.
            Allreplyobj.push({
                userId: user.id,
                replies: [{ name: name, body: body }],
            });
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

// getUserReply
// if (
//     !isReminderExist(reminders, {
//         userid: user.id,
//         username: user.username,
//         repos: [repo],
//         unsubscribedPR: []
//     })
// ) {
//     reminders.push({
//         userid: user.id,
//         username: user.name,
//         repos: [repo],
//         unsubscribedPR: []
//     });
//     await persistence.updateByAssociation(assoc, reminders);
// } else {
//     const idx = reminders.findIndex((u: IReminder) => u.userid === user.id)
//
//     if (!reminders[idx].repos.includes(repo)) {
//         reminders[idx].repos.push(repo);
//     }
//
//     await persistence.updateByAssociation(assoc, reminders)
// }

// export async function unsubscribedPR(read: IRead, persistence: IPersistence, repo: string, Prnum: number, user: IUser): Promise<void> {
//     const reminders = await getAllReply(read);
//     const repository = repo.trim();
//     const PullRequestNumber = Prnum;
//     const index = reminders.findIndex((reminder: IReminder) => reminder.userid === user.id);
//     const reminder = reminders[index] as IReminder
//     const unsubscribPR = reminder.unsubscribedPR.find((value) => value.repo === repository);
//
//     if (unsubscribPR) {
//         const idx = reminder.unsubscribedPR.findIndex((value) => value.repo === repository);
//         const unsubscribPRnums = reminder.unsubscribedPR[idx].prnum;
//         if (!unsubscribPRnums.includes(PullRequestNumber)) {
//             unsubscribPRnums.push(PullRequestNumber);
//         }
//     } else {
//         reminder.unsubscribedPR.push({
//             repo: repository,
//             prnum: [PullRequestNumber]
//         })
//     }
//
//     await persistence.updateByAssociation(assoc, reminders)
// }
//
//
// export async function RemoveReminder(
//     read: IRead,
//     persistence: IPersistence,
//     user: IReminder
// ): Promise<void> {
//     const reminders = await getAllReply(read);
//
//     if (!reminders || !isReminderExist(reminders, user)) {
//         return;
//     }
//
//     const idx = reminders.findIndex((u: IReminder) => u.userid === user.userid);
//     reminders.splice(idx, 1);
//     await persistence.updateByAssociation(assoc, reminders);
// }
//
//
// function isReminderExist(reminders: IReminder[], targetUser: IReminder): boolean {
//     return reminders.some((user) => user.userid === targetUser.userid);
// }
//
// export async function getUserReminder(read: IRead, User: IUser): Promise<IReminder> {
//     const reminders = await getAllReply(read);
//     const index = reminders.findIndex((reminder) => reminder.userid === User.id);
//     return reminders[index];
// }
//
// export async function removeRepoReminder(read: IRead, persistence: IPersistence, repository: string, User: IUser) {
//     const reminders = await getAllReply(read);
//     const idx = reminders.findIndex((u: IReminder) => u.userid === User.id);
//
//     if (idx === -1) {
//         return;
//     }
//
//     const repoindex = reminders[idx].repos.findIndex((repo) => repo == repository);
//
//     if (repoindex === -1) {
//         return;
//     }
//
//     reminders[idx].repos.splice(repoindex, 1);
//     await persistence.updateByAssociation(assoc, reminders);
// }
