
import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { TextObjectType } from "@rocket.chat/apps-engine/definition/uikit/blocks";
import { IUIKitModalViewParam } from "@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { ModalsEnum } from "../enum/Modals";
import { AppEnum } from "../enum/App";
// import { getRoomTasks, getUIData, persistUIData } from '../lib/persistence';
import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import {
    UIKitBlockInteractionContext,
    UIKitInteractionContext,
} from "@rocket.chat/apps-engine/definition/uikit";
import {
    storeInteractionRoomData,
    getInteractionRoomData,
} from "../persistance/roomInteraction";
import { GetReply, getUserReply } from "../persistance/quick";
import { getId, storeId } from "../persistance/saveid";

export async function EditModal({
    modify,
    read,
    persistence,
    http,
    slashcommandcontext,
    uikitcontext,
    value,
}: {
    modify: IModify;
    read: IRead;
    persistence: IPersistence;
    http: IHttp;
    slashcommandcontext?: SlashCommandContext;
    uikitcontext?: UIKitInteractionContext;
    value: string | undefined;
}): Promise<IUIKitModalViewParam> {
    const viewId = ModalsEnum.EDIT_REPLY_VIEW;
    const block = modify.getCreator().getBlockBuilder();
    const room =
        slashcommandcontext?.getRoom() ||
        uikitcontext?.getInteractionData().room;
    const user =
        slashcommandcontext?.getSender() ||
        uikitcontext?.getInteractionData().user;

    let name = value;
    let body;
    let id;
    if (user?.id) {
        let roomId;

        let userReply = await getUserReply(read, user);
        body = userReply?.replies.find((reply) => reply.name === value)?.body;
        id = userReply?.replies.find((reply) => reply.name === value)?.id;
        await storeId(persistence, id);
        console.log(id, "id in edit")
        let storeid = await getId(read.getPersistenceReader());
        console.log(storeid, "id id edti from persistance")

        if (room?.id) {
            roomId = room.id;
            await storeInteractionRoomData(persistence, user.id, roomId);
        } else {
            roomId = (
                await getInteractionRoomData(
                    read.getPersistenceReader(),
                    user.id
                )
            ).roomId;
        }

        block.addInputBlock({
            blockId: ModalsEnum.REPLY_NAME_INPUT,
            label: {
                text: ModalsEnum.REPLY_NAME_LABEL,
                type: TextObjectType.PLAINTEXT,
            },
            element: block.newPlainTextInputElement({
                actionId: ModalsEnum.REPLY_NAME_INPUT_ACTION,
                placeholder: {
                    text: ModalsEnum.REPLY_NAME_PLACEHOLDER,
                    type: TextObjectType.PLAINTEXT,
                },
                initialValue: name,
            }),
        });

        block.addDividerBlock();

        block.addInputBlock({
            blockId: ModalsEnum.REPLY_BODY_INPUT,
            label: {
                text: ModalsEnum.REPLY_BODY_LABEL,
                type: TextObjectType.PLAINTEXT,
            },
            element: block.newPlainTextInputElement({
                actionId: ModalsEnum.REPLY_BODY_INPUT_ACTION,
                placeholder: {
                    text: ModalsEnum.REPLY_BODY_PLACEHOLDER,
                    type: TextObjectType.PLAINTEXT,
                },
                initialValue: body,
                multiline: true,
            }),
        });
    }
    return {
        id: viewId,
        title: {
            type: TextObjectType.PLAINTEXT,
            text: "Edit Reply",
        },
        close: block.newButtonElement({
            text: {
                type: TextObjectType.PLAINTEXT,
                text: "Close",
            },
        }),
        submit: block.newButtonElement({
            actionId: ModalsEnum.SUBMIT_EDIT_REPLY_ACTION,
            text: {
                type: TextObjectType.PLAINTEXT,
                text: "Edit",
            },
        }),
        blocks: block.getBlocks(),
    };
}
