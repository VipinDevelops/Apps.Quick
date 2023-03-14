import { IModify, IPersistence } from '@rocket.chat/apps-engine/definition/accessors';
import { RocketChatAssociationModel, RocketChatAssociationRecord } from '@rocket.chat/apps-engine/definition/metadata';
import { IUIKitModalViewParam } from '@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder';

import { IModalContext } from '../definition';
import { uuid } from './uuid';

export async function createTemplateModal({ id = '', template, persistence, data, modify }: {
    id?: string,
    template?: string,
    persistence: IPersistence,
    data: IModalContext,
    modify: IModify,
    options?: number,
    mode?: string,
}): Promise<IUIKitModalViewParam> {
    const viewId = id || `template-modal-${uuid()}`;

    const viewAssociation = new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, viewId);
    await persistence.updateByAssociation(viewAssociation, data, true);

    const block = modify.getCreator().getBlockBuilder();
    block.addInputBlock({
        blockId: 'template',
        element: block.newPlainTextInputElement({ initialValue: template, actionId: 'template' }),
        label: block.newPlainTextObject('Insert your template'),
    })
    .addDividerBlock();

    return {
        id: viewId,
        title: block.newPlainTextObject('Create a template'),
        submit: block.newButtonElement({
            text: block.newPlainTextObject('Create'),
        }),
        close: block.newButtonElement({
            text: block.newPlainTextObject('Dismiss'),
        }),
        blocks: block.getBlocks(),
    };
}
