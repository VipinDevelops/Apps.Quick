import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
    IUIKitResponse,
    UIKitViewCloseInteractionContext,
} from "@rocket.chat/apps-engine/definition/uikit";
import { QuickApp } from "../../Quick";
import { AiReplyContextualEnum } from "../enum/Contextual/AIModal";
import { deleteAI } from "../persistance/askai";
import { ModalInteractionStorage } from "../storage/ModalINteractionStorage";

export class ExecuteViewClosedHandler {
    private context: UIKitViewCloseInteractionContext;
    constructor(
        protected readonly app: QuickApp,
        protected readonly read: IRead,
        protected readonly http: IHttp,
        protected readonly persistence: IPersistence,
        protected readonly modify: IModify,
        context: UIKitViewCloseInteractionContext
    ) {
        this.context = context;
    }

    public async handleActions(): Promise<IUIKitResponse> {
        const { view } = this.context.getInteractionData();

        const persistenceRead = this.read.getPersistenceReader();
        const modalInteraction = new ModalInteractionStorage(
            this.persistence,
            persistenceRead
        );
        switch (view.id) {
            case AiReplyContextualEnum.VIEW_ID: {
                await modalInteraction.clearState(
                    AiReplyContextualEnum.PROMPT_ACTION
                );
                await modalInteraction.clearState(
                    AiReplyContextualEnum.REPLY_ACTION
                );
                ;
            }
        }
        await deleteAI(this.persistence);

        return this.context.getInteractionResponder().successResponse();
    }
}
