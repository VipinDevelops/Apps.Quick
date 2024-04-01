import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
    IUIKitResponse,
    UIKitBlockInteractionContext,
} from "@rocket.chat/apps-engine/definition/uikit";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { ModalsEnum } from "../enum/Modals";
import { sendMessage, sendUniqueMessage } from "../lib/sendMessage";
import { getInteractionRoomData } from "../persistance/roomInteraction";
import { GetReply, removeReply } from "../persistance/quick";
import { ListModal } from "../modal/ListModal";
import { QuickApp } from "../../Quick";
import { ModalInteractionStorage } from "../storage/ModalINteractionStorage";
import { AiReplyContextualEnum } from "../enum/Contextual/AIModal";
import { generateAiReply } from "../lib/AIGenerate";
import { AiReplyContextualBar } from "../modal/Contextual/AIreply";
import { deleteAI, GetAI, UpdateAI } from "../persistance/askai";

export class ExecuteBlockActionHandler {
    private readonly context: UIKitBlockInteractionContext;

    constructor(
        protected readonly app: QuickApp,
        protected readonly read: IRead,
        protected readonly http: IHttp,
        protected readonly persistence: IPersistence,
        protected readonly modify: IModify,
        context: UIKitBlockInteractionContext
    ) {
        this.context = context;
    }

    public async handleActions(): Promise<IUIKitResponse> {
        const { actionId } = this.context.getInteractionData();

        switch (actionId) {
            case ModalsEnum.SEND_REPLY_ACTION:
                await this.handleSendReplyAction();
                break;
            case ModalsEnum.REPLY_REMOVE_ACTION:
                return this.handleReplyRemoveAction();
            case AiReplyContextualEnum.PROMPT_ACTION:
            case AiReplyContextualEnum.REPLY_ACTION:
            case AiReplyContextualEnum.GENERATE_BUTTON_ACTION:
            case AiReplyContextualEnum.SEND_BUTTON_ACTION:
                return this.handleAiAction(actionId);
        }
        return this.context.getInteractionResponder().successResponse();
    }

    private async handleSendReplyAction(): Promise<void> {
        const { value, user } = this.context.getInteractionData();
        if (!user?.id) return;

        const roomId = (await getInteractionRoomData(
            this.read.getPersistenceReader(),
            user.id
        ))?.roomId;
        if (!roomId) return;

        const room = (await this.read.getRoomReader().getById(roomId)) as IRoom;
        const msg = await GetReply(this.read, this.persistence, value, user);
        await sendUniqueMessage(this.read, this.modify, user, room, `${msg}`);

    }

    private async handleReplyRemoveAction(): Promise<IUIKitResponse> {
        const { value } = this.context.getInteractionData();
        const user = this.context.getInteractionData().user;

        if (typeof value !== 'string' || !user) {
            return this.context.getInteractionResponder().errorResponse();
        }

        await removeReply(this.read, this.persistence, value, user);

        const updatedReminderModal = await ListModal({
            modify: this.modify,
            read: this.read,
            persistence: this.persistence,
            http: this.http,
            uikitcontext: this.context,
        });

        return this.context.getInteractionResponder().updateModalViewResponse(updatedReminderModal);
    }

    private async handleAiAction(actionId: string): Promise<IUIKitResponse> {
        if (actionId === AiReplyContextualEnum.PROMPT_ACTION) {
            return this.handleInputAction(actionId);
        } else if (actionId === AiReplyContextualEnum.GENERATE_BUTTON_ACTION) {
            return this.handleGenerateAiReply();
        } else if (actionId === AiReplyContextualEnum.SEND_BUTTON_ACTION) {
            return this.handleSendAiMessage();
        } else if (actionId === AiReplyContextualEnum.REPLY_ACTION) {
            return this.handleInputAction(actionId);
        }

        return this.context.getInteractionResponder().successResponse();
    }

    private async handleInputAction(actionId: string): Promise<IUIKitResponse> {
        const { value, container } = this.context.getInteractionData();
        const modalInteraction = new ModalInteractionStorage(
            this.persistence,
            this.read.getPersistenceReader()
        );

        if (value) {
            await modalInteraction.storeInputState(actionId, { value });
        } else {
            await modalInteraction.clearState(actionId);
        }

        return this.context.getInteractionResponder().viewErrorResponse({
            viewId: container.id,
            errors: {},
        });
    }

    private async handleGenerateAiReply(): Promise<IUIKitResponse> {
        const modalInteraction = new ModalInteractionStorage(
            this.persistence,
            this.read.getPersistenceReader()
        );
        console.log("generate reply called ");
        const { user, triggerId } = this.context.getInteractionData();
        const { value } = (await modalInteraction.getInputState(
            AiReplyContextualEnum.PROMPT_ACTION
        ))!;

        const response = await generateAiReply(this.read, this.http, value);
        const aiReply = response.data.candidates[0].content.parts[0].text;
        console.log(aiReply);


        await modalInteraction.storeInputState(
            AiReplyContextualEnum.REPLY_ACTION,
            { value: aiReply }
        );


        await UpdateAI("", "", aiReply, "", this.read, this.persistence)
        const contextualBar = await AiReplyContextualBar(
            this.app,
            modalInteraction,
            this.read,
            aiReply
        );

        if (contextualBar instanceof Error) {
            console.log("erorrr ttests")
            this.app.getLogger().error(contextualBar.message);
            return this.context.getInteractionResponder().errorResponse();
        }


        // this.context.getInteractionResponder().updateContextualBarViewResponse(updatedReminderModal);
        return this.context
            .getInteractionResponder()
            .updateContextualBarViewResponse(contextualBar);
    }

    private async handleSendAiMessage(): Promise<IUIKitResponse> {
        const modalInteraction = new ModalInteractionStorage(
            this.persistence,
            this.read.getPersistenceReader()
        );
        const { user, room } = this.context.getInteractionData();
        const { value } = (await modalInteraction.getInputState(
            AiReplyContextualEnum.REPLY_ACTION
        ))!;

        if (room) {
            const ai = await GetAI(this.read)
            await sendMessage(this.modify, user, room, value, ai.threadid);
            // await deleteAI(this.persistence);
        }

        return this.context.getInteractionResponder().successResponse();
    }
}
