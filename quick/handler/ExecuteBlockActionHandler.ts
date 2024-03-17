import {
    IHttp,
    ILogger,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { IApp } from "@rocket.chat/apps-engine/definition/IApp";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { ModalsEnum } from "../enum/Modals";
import {
    ButtonStyle,
    IUIKitResponse,
    TextObjectType,
    UIKitBlockInteractionContext,
} from "@rocket.chat/apps-engine/definition/uikit";
import { QuickApp } from "../Quick";
// import { ReplyModal } from "../modal/ReplyModal";
// import { GetReply, removeReply } from "../persistance/quick";
import { sendMessage } from "../lib/sendMessage";
import { getInteractionRoomData } from "../persistance/roomInteraction";
import { IReply } from "../definitions/reply";
import { UpdateAI } from "../persistance/askai";
import { NewIssueModal } from "../modal/NewIssue";

export class ExecuteBlockActionHandler {

    constructor(
        private readonly app: QuickApp,
        private readonly read: IRead,
        private readonly http: IHttp,
        private readonly modify: IModify,
        private readonly persistence: IPersistence
    ) { }


    public async run(
        context: UIKitBlockInteractionContext
    ): Promise<IUIKitResponse> {
        const data = context.getInteractionData();

        try {
            const { actionId } = data;
            switch (actionId) {
                // case ModalsEnum.REPLY_REMOVE_ACTION: {
                //     const { value, user } = context.getInteractionData();
                //     await removeReply(this.read, this.persistence, value as string, user);
                //
                //     const updatedReminderModal = await ReplyModal({ modify: this.modify, read: this.read, persistence: this.persistence, http: this.http, uikitcontext: context });
                //
                //     return context.getInteractionResponder().updateModalViewResponse(updatedReminderModal);
                // }
                // case ModalsEnum.SEND_REPLY_ACTION: {
                //     const { value, user } = context.getInteractionData();
                //     let room: IRoom | undefined;
                //     let roomId: string = "";
                //     if (user?.id) {
                //         roomId = (await getInteractionRoomData(this.read.getPersistenceReader(), user.id)).roomId;
                //         room = await this.read.getRoomReader().getById(roomId) as IRoom;
                //         const msg: IReply = await GetReply(this.read, this.persistence, value, user)
                //         sendMessage(this.modify, room, user, `${msg.body}`)
                //     }
                // }
                case ModalsEnum.GENERATE_RESPONSE: {
                    const { user, room } = context.getInteractionData();

                    // await removeRepoReminder(this.read, this.persistence, value as string, user);

                    // const updatedReminderModal = await reminderModal({ modify: this.modify, read: this.read, persistence: this.persistence, http: this.http, uikitcontext: context });
                    await UpdateAI("", "", "This is response test", this.read, this.persistence)

                    const modal = await NewIssueModal({
                        modify: this.modify,
                        read: this.read,
                        persistence: this.persistence,
                        http: this.http,
                        user: user,
                        room: room,
                    })
                    return context.getInteractionResponder().updateModalViewResponse(modal);
                }
            }
        } catch (error) {
            console.log(error);
        }

        return context.getInteractionResponder().successResponse();
    }
}
