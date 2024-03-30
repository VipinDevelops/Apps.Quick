import { IRead, IHttp, IModify, IPersistence } from "@rocket.chat/apps-engine/definition/accessors";
import { BlockType, IImageBlock, IImageElement, IUIKitResponse, UIKitActionButtonInteractionContext } from "@rocket.chat/apps-engine/definition/uikit";
import { ModalsEnum } from "../enum/Modals";
import { NewIssueModal } from "../modal/NewIssue";
import { createAI, GetAI, UpdateAI } from "../persistance/askai";
import { storeInteractionRoomData } from "../persistance/roomInteraction";
import { QuickApp } from "../Quick";

export class ExecuteButtonActionHandler {
    constructor(
        private readonly app: QuickApp,
        private readonly read: IRead,
        private readonly http: IHttp,
        private readonly modify: IModify,
        private readonly persistence: IPersistence
    ) { }

    public async run(
        context: UIKitActionButtonInteractionContext
    ): Promise<IUIKitResponse> {
        const data = context.getInteractionData();

        try {
            const { actionId } = data;
            switch (actionId) {
                case "ask-ai": {

                    const { message, user, room } = data;

                    if (message?.text) {
                        console.log('UPdate', message.text)
                        await createAI(message?.text, this.read, this.persistence);
                    }
                    await storeInteractionRoomData(this.persistence, user.id, room.id);

                    const modal = await NewIssueModal({
                        modify: this.modify,
                        read: this.read,
                        persistence: this.persistence,
                        http: this.http,
                        user: user,
                        room: room,
                    })

                    return context.getInteractionResponder().openModalViewResponse(modal)
                }

            }
        } catch (error) {
            console.log(error)
        }

        return context.getInteractionResponder().successResponse()
    }
}
