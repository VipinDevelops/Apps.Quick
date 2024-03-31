import {
    IPersistence,
    IRead,
    ISettingRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
    RocketChatAssociationModel,
    RocketChatAssociationRecord,
} from "@rocket.chat/apps-engine/definition/metadata";

export interface IAI {
    message: string;
    prompt: string;
    response: string;
    threadid: string;
}

const assoc = new RocketChatAssociationRecord(
    RocketChatAssociationModel.MISC,
    "aireply"
);

export async function createAI(
    message: string,
    read: IRead,
    persistence: IPersistence
): Promise<void> {
    const newdata: IAI = {
        message: message,
        prompt: "",
        response: "",
        threadid: ""
    };
    await persistence.createWithAssociation(newdata, assoc);
}
export async function UpdateAI(
    message: string,
    prompt: string,
    response: string,
    threadid: string,
    read: IRead,
    persistence: IPersistence
): Promise<void> {
    const existingSetting = await GetAI(read);

    const updatedSetting: IAI = {
        message: message !== "" ? message : existingSetting.message,
        prompt: prompt !== "" ? prompt : existingSetting.prompt,
        response: response !== "" ? response : existingSetting.response,
        threadid: threadid !== "" ? threadid : existingSetting.threadid,
    };

    await persistence.updateByAssociation(assoc, updatedSetting, true);
}

export async function GetAI(read: IRead): Promise<IAI> {
    const data = await read.getPersistenceReader().readByAssociation(assoc);
    const AIreplyData = data[0] as IAI;
    return AIreplyData;
}

export async function deleteAI(persistence: IPersistence) {
    persistence.removeByAssociation(assoc);
}
