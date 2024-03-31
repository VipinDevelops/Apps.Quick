export interface IModalInteractionStorage {
    storeInputState(key: string, value: IInputStatevalue): Promise<void>; //store or update state
    storeSavedRepliesState(key: string, value: ISavedReplies): Promise<void>; //store or update state
    getInputState(key: string): Promise<IInputStatevalue | undefined>;
    getSavedRepliesState(key: string): Promise<ISavedReplies | undefined>;
    clearState(associate: string): Promise<void>;
    // updateState(associate: string, state: object): Promise<void>; //internal
}

export interface IInputStatevalue {
    value: string;
}

export interface ISavedReplies {
    value: {
        id: string;
        message: string;
    }[];
}
