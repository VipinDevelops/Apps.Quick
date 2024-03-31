import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { UIKitViewSubmitInteractionContext } from "@rocket.chat/apps-engine/definition/uikit";
import { ModalsEnum } from "../enum/Modals";
import { sendMessage } from "../lib/sendMessage";
import { deleteAI, GetAI } from "../persistance/askai";
import { getInteractionRoomData } from "../persistance/roomInteraction";
import { QuickApp } from "../../Quick";
import { createReply } from "./persistance/StoreReply";
export class ExecuteViewSubmitHandler {
    constructor(
        private readonly app: QuickApp,
        private readonly read: IRead,
        private readonly http: IHttp,
        private readonly modify: IModify,
        private readonly persistence: IPersistence
    ) { }

    public async run(context: UIKitViewSubmitInteractionContext) {
        const { user, view } = context.getInteractionData();

        try {
            switch (view.id) {
                case ModalsEnum.CREATE_REPLY_VIEW: {
                    const { roomId } = await getInteractionRoomData(
                        this.read.getPersistenceReader(),
                        user.id
                    );

                    if (roomId) {
                        let room = (await this.read
                            .getRoomReader()
                            .getById(roomId)) as IRoom;
                        let name = view.state?.[ModalsEnum.REPLY_NAME_INPUT]?.[
                            ModalsEnum.REPLY_NAME_INPUT_ACTION
                        ] as string;
                        let body = view.state?.[ModalsEnum.REPLY_BODY_INPUT]?.[
                            ModalsEnum.REPLY_BODY_INPUT_ACTION
                        ] as string;
                        console.log(name, body);

                        await createReply(
                            name,
                            body,
                            room,
                            this.read,
                            this.app,
                            this.persistence,
                            this.modify,
                            this.http,
                            user
                        );
                    }
                    break;
                }
                case ModalsEnum.SEND_AI_RESPONSE: {
                    const aiData = await GetAI(this.read);
                    const { roomId } = await getInteractionRoomData(
                        this.read.getPersistenceReader(),
                        user.id
                    );
                    if (roomId) {
                        let room = (await this.read
                            .getRoomReader()
                            .getById(roomId)) as IRoom;
                        console.log(aiData);
                        await sendMessage(this.modify, user, room, aiData.response)
                        await deleteAI(this.persistence);
                    }
                }
                default:
                    break;
            }
        } catch (error) {
            console.log("error : ", error);
        }

        return {
            success: true,
        };
    }
}
