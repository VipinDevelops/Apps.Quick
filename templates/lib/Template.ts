import { sendMessage } from "./sendMessage";
import { sendNotification } from "./sendNotification";
import { edit } from "../storage/storetemplate";
import { create } from "../storage/storetemplate";
import { getallData } from "../storage/storetemplate";
import {remove} from "../storage/storetemplate";
type data ={
    name: string,
    template: string
}

export async function storeTemplate(modify,room,name,template,read,user,persistence){
    await create(read,persistence,name,template);
    sendNotification(read,modify, user,room,`Template *${name}* created successfully 👍`);
}
export async function sendTemplateMessage(name,read,modify,room,user){
    const Templates:data[] = await getallData(read);
    Templates.forEach(element => {
        if(element.name === name){
            sendMessage(modify, room, user, element.template);
        }
    });
}

export async function listTemplateMessages(modify,read,user,room){
    const Templates:data[] = await getallData(read) ;
    if(Templates.length === 0){
        await sendNotification(read,modify, user,room,`No templates found 😓`)
        return;
    }
    await sendNotification(read,modify, user,room,`*List of templates* 👇    
    `);
    Templates.forEach(element => {
        sendNotification(read,modify, user,room, 
            `*Name:* ${element.name}
        *Template:* ${element.template}

        `)
    });
}

export async function deleteTemplateMessage(read,persistance,user,name,modify,room) {
    await remove(read,persistance,name);
    sendNotification(read,modify, user,room,`Template *${name}* deleted 🔥`)
}

export async function editTemplateMessage(read,persistance,name,template,modify,room,user) {
    await edit(read,persistance,name,template);
    sendNotification(read,modify, user,room,`Template *${name}* edited to ${template}`)
}