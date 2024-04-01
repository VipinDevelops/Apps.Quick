import { IRead, IUIKitSurfaceViewParam } from "@rocket.chat/apps-engine/definition/accessors";
import { Block, TextObjectType } from "@rocket.chat/ui-kit";
import { ButtonStyle, UIKitSurfaceType } from "@rocket.chat/apps-engine/definition/uikit";
import { ButtonInSectionComponent } from "../common/buttonInSectionComponent";
import { AiReplyContextualEnum } from "../../enum/Contextual/AIModal";
import { QuickApp } from "../../../Quick";
import { ModalInteractionStorage } from "../../storage/ModalINteractionStorage";
import { inputElementComponent } from "../common/inputElementComponent";
import { GetAI } from "../../persistance/askai";

export async function AiReplyContextualBar(
    app: QuickApp,
    modalInteraction: ModalInteractionStorage,
    read: IRead,
    response?: string
): Promise<IUIKitSurfaceViewParam | Error> {
    const { elementBuilder, blockBuilder } = app.getUtils();

    const blocks: Block[] = [];

    const ai = await GetAI(read)
    const messagecontext = blockBuilder.createContextBlock({ contextElements: ["Message", ai.message] })
    blocks.push(messagecontext);
    // Create input element for prompt message
    const promptInput = inputElementComponent(
        {
            app,
            label: AiReplyContextualEnum.PROMPT_LABEL,
            placeholder: "",
            optional: false,
            dispatchActionConfigOnInput: true,
            // initialValue: prompt,
        },
        {
            actionId: AiReplyContextualEnum.PROMPT_ACTION,
            blockId: AiReplyContextualEnum.PROMPT_BLOCK,
        }
    );

    // Create button for generating reply
    const generateButton = ButtonInSectionComponent(
        {
            app,
            buttonText: AiReplyContextualEnum.GENERATE_BUTTON_LABEL,
            style: ButtonStyle.PRIMARY,

        },
        {
            actionId: AiReplyContextualEnum.GENERATE_BUTTON_ACTION,
            blockId: AiReplyContextualEnum.GENERATE_BUTTON_BLOCK,
        }
    );

    const divider = blockBuilder.createDividerBlock();
    // Push prompt message and generate reply button to blocks
    blocks.push(promptInput, generateButton, divider);

    // If response exists, create input element for reply message and send button
    //
    if (response) {
        const replyInput = inputElementComponent(
            {
                app,
                label: AiReplyContextualEnum.REPLY_LABEL,
                placeholder: "",
                multiline: true,
                optional: false,
                initialValue: response,
                dispatchActionConfigOnInput: true,
            },
            {
                actionId: AiReplyContextualEnum.REPLY_ACTION,
                blockId: AiReplyContextualEnum.REPLY_BLOCK,
            }
        );
        const sendButton = ButtonInSectionComponent(
            {
                app,
                buttonText: AiReplyContextualEnum.SEND_BUTTON_LABEL,
                style: ButtonStyle.PRIMARY,
            },
            {
                actionId: AiReplyContextualEnum.SEND_BUTTON_ACTION,
                blockId: AiReplyContextualEnum.SEND_BUTTON_BLOCK,
            }
        );
        blocks.push(replyInput, sendButton);
    }

    // Create close button
    const closeButton = elementBuilder.addButton(
        {
            text: AiReplyContextualEnum.CLOSE_BUTTON_LABEL,
            style: ButtonStyle.DANGER,
        },
        {
            actionId: AiReplyContextualEnum.CLOSE_ACTION,
            blockId: AiReplyContextualEnum.CLOSE_BLOCK,
        }
    );

    return {
        id: AiReplyContextualEnum.VIEW_ID,
        type: UIKitSurfaceType.CONTEXTUAL_BAR,
        title: {
            type: TextObjectType.MRKDWN,
            text: AiReplyContextualEnum.TITLE,
        },
        blocks,
        close: closeButton,
    };
}
