import { IUIKitBlockIncomingInteraction } from '@rocket.chat/apps-engine/definition/uikit/UIKitIncomingInteractionTypes';

export interface IModalContext extends Partial<IUIKitBlockIncomingInteraction> {
    threadId?: string;
}