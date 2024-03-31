import {
    IPersistence,
    IPersistenceRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
    RocketChatAssociationModel,
    RocketChatAssociationRecord,
} from "@rocket.chat/apps-engine/definition/metadata";
import {
    IInputStatevalue,
    IModalInteractionStorage,
    ISavedReplies,
} from "../lib/IModalInteraction";

export class ModalInteractionStorage implements IModalInteractionStorage {
    constructor(
        private readonly persistence: IPersistence,
        private readonly persistenceRead: IPersistenceRead
    ) {}

    public async storeInputState(
        key: string,
        value: IInputStatevalue
    ): Promise<void> {
        await this.storeState(key, value);
    }

    public async storeSavedRepliesState(
        key: string,
        value: ISavedReplies
    ): Promise<void> {
        await this.storeState(key, value);
    }

    public async getInputState(
        key: string
    ): Promise<IInputStatevalue | undefined> {
        const result = await this.getState(key);
        return result as IInputStatevalue;
    }

    public async getSavedRepliesState(
        key: string
    ): Promise<ISavedReplies | undefined> {
        const result = await this.getState(key);
        return result as ISavedReplies;
    }

    public async clearState(key: string): Promise<void> {
        const association = new RocketChatAssociationRecord(
            RocketChatAssociationModel.USER,
            key
        );

        await this.persistence.removeByAssociation(association);
    }

    private async storeState(key: string, value: object): Promise<void> {
        const association = new RocketChatAssociationRecord(
            RocketChatAssociationModel.USER,
            key
        );

        const [oldState] = await this.persistenceRead.readByAssociation(
            association
        );

        if (oldState) {
            await this.persistence.updateByAssociation(
                association,
                value,
                true
            );
        } else {
            await this.persistence.createWithAssociation(value, association);
        }
    }

    private async getState(key: string): Promise<object | undefined> {
        const association = new RocketChatAssociationRecord(
            RocketChatAssociationModel.USER,
            key
        );

        const [result] = await this.persistenceRead.readByAssociation(
            association
        );

        return result;
    }
}
