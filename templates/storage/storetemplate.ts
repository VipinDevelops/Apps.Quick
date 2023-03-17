import {
    IPersistence,
    IRead
} from '@rocket.chat/apps-engine/definition/accessors';
import {
    RocketChatAssociationModel,
    RocketChatAssociationRecord
} from '@rocket.chat/apps-engine/definition/metadata';

const assoc = new RocketChatAssociationRecord(
    RocketChatAssociationModel.MISC,
    'templates'
);


export async function create(
    read: IRead,
    persistence: IPersistence,
    name: string,
    template: string
): Promise<void> {
    const templates:any[] = await getallData(read);
    if (!templates) {
        await persistence.createWithAssociation(
                {
                name: name,
                 template: template               
                },
            assoc
        );
        return;
    }

    if (
        !isDataPresent(templates, name)
    ) {
        templates.push({name: name, template: template});
        await persistence.updateByAssociation(assoc, templates);
    } else {
        console.log('error: Template was already present in db');
    }
}

export async function remove(
    read: IRead,
    persistence: IPersistence,
    name: string
): Promise<void> {
    const templates = await getallData(read);

    if (!templates || !isDataPresent(templates, name)) {
        return;
    }
    const index = await templates.findIndex((template:any) => template.name === name);
    templates.splice(index,1);
    await persistence.updateByAssociation(assoc, templates);
}

export async function getallData(read: IRead): Promise<[]> {
    const data = await read.getPersistenceReader().readByAssociation(assoc);
    return data.length ? (data[0] as []) : [];
}

function isDataPresent(templates, name): boolean {
    return templates.some((data) => data.name === name);
}

export async function edit(
    read: IRead,
    persistence: IPersistence,
    name: string,
    template: string
): Promise<void> {
    const templates:any[] = await getallData(read);
    if (!templates) {
        //empty db 
        // await persistence.createWithAssociation(
        //         {
        //         name: name,
        //          template: template               
        //         },
        //     assoc
        // );
        return;
    }

    if (
        isDataPresent(templates, name)
    ) {
        templates.forEach(element => {
            if(element.name === name){
                element.template = template;
            }
        });
        await persistence.updateByAssociation(assoc, templates);
    } else {
        console.log('error: Template was not present in db');
    }
}