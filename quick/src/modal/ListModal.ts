import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
    ButtonStyle,
    ITextObject,
    TextObjectType,
} from "@rocket.chat/apps-engine/definition/uikit/blocks";
import { IUIKitModalViewParam } from "@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder";
import { ModalsEnum } from "../enum/Modals";
import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import {
    UIKitBlockInteractionContext,
    UIKitInteractionContext,
} from "@rocket.chat/apps-engine/definition/uikit";
import { getUserReply } from "../persistance/quick";
import { IReply } from "../../definitions/reply";
import { getInteractionRoomData, storeInteractionRoomData } from "../persistance/roomInteraction";

export async function ListModal({
    modify,
    read,
    persistence,
    http,
    slashcommandcontext,
    uikitcontext,
}: {
    modify: IModify;
    read: IRead;
    persistence: IPersistence;
    http: IHttp;
    slashcommandcontext?: SlashCommandContext;
    uikitcontext?: UIKitInteractionContext;
}): Promise<IUIKitModalViewParam> {
    const viewId = ModalsEnum.REPLY_LIST_MODAL_VIEW;

    const block = modify.getCreator().getBlockBuilder();

    const room =
        slashcommandcontext?.getRoom() ||
        uikitcontext?.getInteractionData().room;
    const user =
        slashcommandcontext?.getSender() ||
        uikitcontext?.getInteractionData().user;

    if (user?.id) {
        let roomId;

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
        block.addDividerBlock();

        if (user?.id) {
            const reply: IReply | undefined = await getUserReply(read, user);
            const replys = reply?.replies;

            console.log(replys);
            if (replys && replys.length > 0) {
                for (let reply of replys) {
                    block.addSectionBlock({
                        text: {
                            text: `${reply.name}`,
                            type: TextObjectType.PLAINTEXT,
                        },
                    });
                    const newbody = reply.body.slice(0, 60);

                    block.addContextBlock({
                        elements: [
                            { type: TextObjectType.PLAINTEXT, text: `${newbody}` },
                        ],
                    });
                    block.addActionsBlock({
                        blockId: ModalsEnum.REPLY_LIST_MODAL,

                        elements: [
                            block.newButtonElement({
                                actionId: ModalsEnum.SEND_REPLY_ACTION,
                                text: block.newPlainTextObject("Send"),
                                value: `${reply.name}`,
                                style: ButtonStyle.PRIMARY,
                            }),
                            block.newButtonElement({
                                actionId: ModalsEnum.REPLY_REMOVE_ACTION,
                                text: block.newPlainTextObject("Remove"),
                                value: `${reply.name}`,
                                style: ButtonStyle.DANGER,
                            }),
                        ],
                    });

                    block.addDividerBlock();
                }
            } else {
                block.addSectionBlock({
                    text: {
                        text: "You have no quick reply yet.",
                        type: TextObjectType.PLAINTEXT,
                    },
                });
            }
        }
    }

    return {
        id: viewId,
        title: {
            type: TextObjectType.PLAINTEXT,
            text: "Quick Reply List",
        },
        close: block.newButtonElement({
            text: {
                type: TextObjectType.PLAINTEXT,
                text: "Close",
            },
        }),
        blocks: block.getBlocks(),
    };
}
