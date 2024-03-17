
import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { TextObjectType } from "@rocket.chat/apps-engine/definition/uikit/blocks";
import { IUIKitModalViewParam } from "@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder";
import { ModalsEnum } from "../enum/Modals";
import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import {
    UIKitBlockInteractionContext,
    UIKitInteractionContext,
} from "@rocket.chat/apps-engine/definition/uikit";
import {
    storeInteractionRoomData,
    getInteractionRoomData,
} from "../persistance/roomInteraction";


export async function SearchModal({
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
    const viewId = ModalsEnum.SEARCH_VIEW;
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

        // shows indentations in input blocks but not inn section block
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
            }),
        });
    }

    block.addDividerBlock();

    return {
        id: viewId,
        title: {
            type: TextObjectType.PLAINTEXT,
            text: ModalsEnum.SEARCH_VIEW_TITLE,
        },
        close: block.newButtonElement({
            text: {
                type: TextObjectType.PLAINTEXT,
                text: "Close",
            },
        }),
        submit: block.newButtonElement({
            actionId: ModalsEnum.GITHUB_SEARCH_ACTION,
            text: {
                type: TextObjectType.PLAINTEXT,
                text: "Search",
            },
        }),
        blocks: block.getBlocks(),
    };

}
