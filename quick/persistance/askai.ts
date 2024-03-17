import {
    IPersistence,
    IRead,
    ISettingRead
} from '@rocket.chat/apps-engine/definition/accessors';
import {
    RocketChatAssociationModel,
    RocketChatAssociationRecord
} from '@rocket.chat/apps-engine/definition/metadata';

export interface IAI {
    message: string;
    prompt: string;
    response: string;
}

const assoc = new RocketChatAssociationRecord(
    RocketChatAssociationModel.MISC,
    'aireply'
);

export async function createAI(message: string, read: IRead, persistence: IPersistence): Promise<void> {

    const newdat: IAI = {
        message: message,
        prompt: "", response: ""

    }
    await persistence.createWithAssociation(newdat, assoc)

}
export async function UpdateAI(
    message: string,
    prompt: string,
    response: string,
    read: IRead,
    persistence: IPersistence,
): Promise<void> {
    const existingSetting = await GetAI(read);

    const updatedSetting: IAI = {
        message: message !== "" ? message : existingSetting.message,
        prompt: prompt !== "" ? prompt : existingSetting.prompt,
        response: response !== "" ? response : existingSetting.response,
    };


    await persistence.updateByAssociation(assoc, updatedSetting, true);
}

export async function GetAI(
    read: IRead,
): Promise<IAI> {
    const data = await read.getPersistenceReader().readByAssociation(assoc);
    const settingData = data[0] as IAI;
    return settingData;
}

export async function deleteAI(persistence: IPersistence) {
    persistence.removeByAssociation(assoc)
}
