import { IRead, IModify, IHttp, IPersistence } from "@rocket.chat/apps-engine/definition/accessors";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { TemplatesApp } from "../TemplatesApp";
import { ExecutorProps } from "../definitions/ExecutorProps";
import { sendMessage } from "./sendMessage";
import  {storeTemplate,sendTemplateMessage,listTemplateMessages,deleteTemplateMessage,editTemplateMessage}  from "./Template";

export class CommandUtility implements ExecutorProps{
    sender: IUser;
    room: IRoom;
    command: string[];
    bot: IUser;
    context: SlashCommandContext;
    read: IRead;
    modify: IModify;
    http: IHttp;
    persistence: IPersistence;
    app: TemplatesApp;
 
    constructor(props: ExecutorProps) {
        this.sender = props.sender;
        this.room = props.room;
        this.command = props.command;
        this.context = props.context;
        this.read = props.read;
        this.modify = props.modify;
        this.http = props.http;
        this.persistence = props.persistence;
        this.app = props.app;
        this.bot = props.bot;
    }

    public async createTemplate() {
        const name = this.command[1];
        let template="";
        for (let i = 2; i < this.command.length; i++) {
            template += ` ${this.command[i]}`;
        }
        // sendMessage(this.modify, this.room, this.bot, `create template  name: ${name} template: ${template} `);
        storeTemplate(this.modify,this.room,name,template,this.bot);
    }
    public async sendTemplate(name: string) {
        // sendMessage(this.modify, this.room, this.sender, 'send template');
        sendTemplateMessage(name,this.modify,this.room,this.sender)
    }

    public async listTemplates() {
        // sendMessage(this.modify, this.room, this.bot, 'list templates');
        listTemplateMessages(this.modify,this.room,this.bot);
    }
    public async deleteTemplate(name) {
        // sendMessage(this.modify, this.room, this.bot, 'delete template');
        deleteTemplateMessage(name,this.modify,this.room,this.bot);
    }
    public async editTemplate(name) {
        let template="";
        for (let i = 2; i < this.command.length; i++) {
            template += ` ${this.command[i]}`;
        }
        // sendMessage(this.modify, this.room, this.sender, 'edit template');
        editTemplateMessage(name,template,this.modify,this.room,this.bot);
    }
    public async help() {
        sendMessage(this.modify, this.room, this.bot, 
        `## Template Commands
        */template create <name> <template> * - create a template
        */template send <name> *   - send a template
        */template list*   - list all templates
        */template delete <name> * - delete a template
        */template edit <name> <new template>*   - edit a template
        `);
    }
    public async sayHello() {
        const message = `👋 Hey ${this.sender.name}!  \n Use */template help* to see the list of available commands.`;
        await sendMessage(this.modify, this.room, this.bot, message);
      }
      
    public async resolveCommand() {
        switch (this.command[0]) {
            case 'create':
                this.createTemplate();
                break;
            case 'list':
                this.listTemplates();
                break;
            case 'send':
                this.sendTemplate(this.command[1]);
                break;
            case 'delete':
                this.deleteTemplate(this.command[1]);
                break;
            case 'edit':
                this.editTemplate(this.command[1]);
                break;
            case 'help':
                this.help();
                break;
            default:
                this.sayHello();
                break;
        }
    }
    
}