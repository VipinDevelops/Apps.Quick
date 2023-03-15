import { sendMessage } from "./sendMessage";

const Templates:any = [];

export async function storeTemplate(modify,room,name,template,bot){
    const data = {
        name: name,
        template: template
    }
    Templates.push(data);
    sendMessage(modify, room, bot, `Template *${name}* created successfully 👍`);
}
export async function sendTemplateMessage(name,modify,room,sender){
    //find the data in templates which matches the name
    const template = Templates.find((template:any) => template.name === name);
    sendMessage(modify, room, sender, template.template);
}

export async function listTemplateMessages(modify,room,bot){
    if(Templates.length === 0){
        sendMessage(modify, room, bot, `No templates found 😓`);
        return;
    }
    await sendMessage(modify, room, bot, `*List of templates* 👇`);
    Templates.forEach(element => {
        sendMessage(modify, room,bot, 
            `*Name:* ${element.name}
        *Template:* ${element.template}

        `)
    });
}

export async function deleteTemplateMessage(name,modify,room,bot) {
    //find the data in templates which matches the name and delete it
    const index = Templates.findIndex((template:any) => template.name === name);
    Templates.splice(index,1);
    sendMessage(modify, room, bot, `Template *${name}* deleted 🔥`);
}

export async function editTemplateMessage(name,template,modify,room,bot) {
    //find the data in templates which matches the name and edit it
    const index = Templates.findIndex((template:any) => template.name === name);
    Templates[index].template = template;
    sendMessage(modify, room, bot, `Template *${name}* edited to ${template}`);
}