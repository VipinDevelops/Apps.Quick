import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { IHanderParams, IHandler } from "../../definitions/handlers/IHandler";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { QuickApp } from "../../Quick";
import { ModalsEnum } from "../enum/Modals";
import { AiReplyContextualBar } from "../modal/Contextual/AIreply";
import { ModalInteractionStorage } from "../storage/ModalINteractionStorage";
import { AiReplyContextualEnum } from "../enum/Contextual/AIModal";

export class QuickAIHandler implements IHandler {
    public app: QuickApp;
    public sender: IUser;
    public room: IRoom;
    public read: IRead;
    public modify: IModify;
    public http: IHttp;
    public persis: IPersistence;
    public modalInteraction: ModalInteractionStorage;
    public triggerId?: string;
    public threadId?: string;

    constructor(params: IHanderParams) {
        this.app = params.app;
        this.sender = params.sender;
        this.room = params.room;
        this.read = params.read;
        this.modify = params.modify;
        this.http = params.http;
        this.persis = params.persis;
        this.triggerId = params.triggerId;
        this.threadId = params.threadId;
        const persistenceRead = params.read.getPersistenceReader();
        this.modalInteraction = new ModalInteractionStorage(
            this.persis,
            persistenceRead
        );
    }

    public async CreateAIreply(): Promise<void> {
        const contextualBar = await AiReplyContextualBar(
            this.app,
            this.modalInteraction,
            this.read
        );

        if (contextualBar instanceof Error) {
            this.app.getLogger().error(contextualBar.message);
            return;
        }

        const triggerId = this.triggerId;

        if (triggerId) {
            await this.modify.getUiController().openSurfaceView(
                contextualBar,
                {
                    triggerId,
                },
                this.sender
            );
        }
    }
}
