import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { ButtonStyle, TextObjectType } from "@rocket.chat/apps-engine/definition/uikit/blocks";
import { IUIKitModalViewParam } from "@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { ModalsEnum } from "../enum/Modals";
import { AppEnum } from "../enum/App";
import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import {
    UIKitBlockInteractionContext,
    UIKitInteractionContext,
} from "@rocket.chat/apps-engine/definition/uikit";
import {
    storeInteractionRoomData,
    getInteractionRoomData,
} from "../persistance/roomInteraction";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { GetAI, IAI } from "../persistance/askai";

export async function NewIssueModal({
    modify,
    read,
    persistence,
    http,
    user,
    room,
    slashcommandcontext,
    uikitcontext,
}: {
    modify: IModify;
    read: IRead;
    persistence: IPersistence;
    http: IHttp;
    user?: IUser,
    room?: IRoom,
    slashcommandcontext?: SlashCommandContext;
    uikitcontext?: UIKitInteractionContext;
}): Promise<IUIKitModalViewParam> {
    const viewId = ModalsEnum.NEW_ISSUE_VIEW;
    const block = modify.getCreator().getBlockBuilder();
    if (user == undefined && slashcommandcontext != undefined) {
        user = slashcommandcontext?.getSender() || uikitcontext?.getInteractionData().user;
    }
    if (room == undefined && slashcommandcontext != undefined) {
        room = slashcommandcontext?.getRoom() || uikitcontext?.getInteractionData().room;
    }
    const AI: IAI = await GetAI(read);
    console.log(AI);

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

        // if (data?.repository != undefined) {
        //     block.addInputBlock({
        //         blockId: ModalsEnum.PROMPT_INPUT,
        //         label: {
        //             text: ModalsEnum.PROMPT_LABEL,
        //             type: TextObjectType.PLAINTEXT,
        //         },
        //         element: block.newPlainTextInputElement({
        //             actionId: ModalsEnum.PROMPT_INPUT_ACTION,
        //             placeholder: {
        //                 text: ModalsEnum.PROMPT_PLACE_HOLDER,
        //                 type: TextObjectType.PLAINTEXT,
        //             },
        //             initialValue: data?.repository
        //         }),
        //     });
        // } else {
        block.addInputBlock({
            blockId: ModalsEnum.PROMPT_INPUT,
            label: {
                text: ModalsEnum.PROMPT_LABEL,
                type: TextObjectType.PLAINTEXT,
            },
            element: block.newPlainTextInputElement({
                actionId: ModalsEnum.PROMPT_INPUT_ACTION,
                placeholder: {
                    text: ModalsEnum.PROMPT_PLACE_HOLDER,
                    type: TextObjectType.PLAINTEXT,
                },
                // initialValue: AI?.prompt
            }),
        });

        if (AI?.response != "") {
            block.addInputBlock({
                blockId: ModalsEnum.RESPONSE_INPUT,
                label: {
                    text: ModalsEnum.RESPONSE_LABEL,
                    type: TextObjectType.PLAINTEXT,
                },
                element: block.newPlainTextInputElement({
                    actionId: ModalsEnum.RESPONSE_INPUT_ACTION,
                    multiline: true,
                    placeholder: {
                        text: ModalsEnum.RESPONSE_PLACE_HOLDER,
                        type: TextObjectType.PLAINTEXT,

                    },
                    initialValue: AI?.response
                }),
            });
        }

        block.addActionsBlock({
            blockId: "githubdata",
            elements: [
                block.newButtonElement({
                    actionId: ModalsEnum.GENERATE_RESPONSE,
                    text: block.newPlainTextObject("Generate"),
                    // value: `${username}/${repositoryName} ${pullNumber}`,
                    style: ButtonStyle.PRIMARY
                }),
            ]
        })

    }


    // }

    block.addDividerBlock();

    return {
        id: viewId,
        title: {
            type: TextObjectType.PLAINTEXT,
            text: "Quick Reply",
        },
        close: block.newButtonElement({
            text: {
                type: TextObjectType.PLAINTEXT,
                text: "Close",
            },
        }),
        submit: block.newButtonElement({
            actionId: ModalsEnum.NEW_ISSUE_ACTION,
            text: {
                type: TextObjectType.PLAINTEXT,
                text: "Send Reply",
            },
        }),
        blocks: block.getBlocks(),
    };
}

