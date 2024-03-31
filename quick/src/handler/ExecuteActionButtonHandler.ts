import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
    IUIKitResponse,
    UIKitActionButtonInteractionContext,
} from "@rocket.chat/apps-engine/definition/uikit";
import { IMessage } from "@rocket.chat/apps-engine/definition/messages";
import { QuickApp } from "../../Quick";
import { ActionButton } from "../enum/ActionButtons";
import { sendNotification } from "../lib/sendNotification";
import { QuickAIHandler } from "./QuickAIHandler";
import { createAI, UpdateAI } from "../persistance/askai";

export class ExecuteActionButtonHandler {
    private context: UIKitActionButtonInteractionContext;
    constructor(
        protected readonly app: QuickApp,
        protected readonly read: IRead,
        protected readonly http: IHttp,
        protected readonly persistence: IPersistence,
        protected readonly modify: IModify,
        context: UIKitActionButtonInteractionContext
    ) {
        this.context = context;
    }

    public async handleActions(): Promise<IUIKitResponse> {
        const { actionId, user, room, triggerId, message, threadId } =
            this.context.getInteractionData();

        const handler = new QuickAIHandler({
            app: this.app,
            sender: user,
            room: room,
            read: this.read,
            modify: this.modify,
            http: this.http,
            persis: this.persistence,
            triggerId,
        });

        switch (actionId) {
            case ActionButton.ASK_AI: {
                /// Old Modal
                // const { message, user, room } = data;
                // if (message?.text) {
                //     // console.log('UPdate', message.text)
                //     await createAI(
                //         message?.text,
                //         this.read,
                //         this.persistence
                //     );
                // }
                // await storeInteractionRoomData(
                //     this.persistence,
                //     user.id,
                //     room.id
                // );
                // const modal = await AskAIModal({
                //     modify: this.modify,
                //     read: this.read,
                //     persistence: this.persistence,
                //     http: this.http,
                //     user: user,
                //     room: room,
                // });
                // return context
                //     .getInteractionResponder()
                //     .openModalViewResponse(modal);

                ///// New Handler (contexualbar)

                if (message && message.text) {
                    // console.log(message.threadId, "threadId");
                    console.log(threadId, "threadId")
                    await createAI(message.text, this.read, this.persistence)
                    if (threadId) {
                        await UpdateAI("", '', "", threadId, this.read, this.persistence)
                    }
                    await handler.CreateAIreply(this.http, message.text);
                } else {
                    sendNotification(
                        this.read,
                        this.modify,
                        user,
                        room,
                        "Hey, I need a message to generate a reply."
                    );
                    return this.context
                        .getInteractionResponder()
                        .errorResponse();
                }

                break;
            }
        }

        return this.context.getInteractionResponder().successResponse();
    }
}
