import {
    IPersistence,
    IPersistenceRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
    RocketChatAssociationModel,
    RocketChatAssociationRecord,
} from "@rocket.chat/apps-engine/definition/metadata";

// Define association for storing the ID
const association = new RocketChatAssociationRecord(
    RocketChatAssociationModel.MISC,
    `Id`
);

export interface Iid {
    id: string;
}

// Store ID function
export const storeId = async (
    persistence: IPersistence,
    Id: string,
): Promise<void> => {
    await persistence.updateByAssociation(
        association,
        {id:Id},
        true // Upsert: If the record doesn't exist, create a new one.
    );
    console.log("Id stored",Id);
};

// Get ID function
export const getId = async (
    persistenceRead: IPersistenceRead,
): Promise<Iid> => {
    const result = await persistenceRead.readByAssociation(
        association
    );
    return result[0] as Iid;
};

// Clear ID function
export const clearId = async (
    persistence: IPersistence,
): Promise<void> => {
    await persistence.removeByAssociation(association);
};
