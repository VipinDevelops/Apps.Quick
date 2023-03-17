import { IRead, IModify, IHttp, IPersistence } from "@rocket.chat/apps-engine/definition/accessors";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { TemplatesApp } from "../TemplatesApp";
import { ExecutorProps } from "../definitions/ExecutorProps";
import { sendMessage } from "./sendMessage";
import  {storeTemplate,sendTemplateMessage,listTemplateMessages,deleteTemplateMessage,editTemplateMessage}  from "./Template";
import { sendNotification } from "./sendNotification";

export class CommandUtility implements ExecutorProps{
    user: IUser;
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
        this.user = props.user;
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
        storeTemplate(this.modify,this.room,name,template,this.read,this.user,this.persistence);
    }
    public async sendTemplate(name: string) {
        sendTemplateMessage(name,this.read,this.modify,this.room,this.user)
    }

    public async listTemplates() {
        listTemplateMessages(this.modify,this.read,this.user,this.room);
    }
    public async deleteTemplate(name) {
        deleteTemplateMessage(this.read,this.persistence,this.user,name,this.modify,this.room);
    }
    public async editTemplate(name) {
        let template="";
        for (let i = 2; i < this.command.length; i++) {
            template += ` ${this.command[i]}`;
        }
        editTemplateMessage(this.read,this.persistence,name,template,this.modify,this.room,this.user);
    }
    public async help() {
        sendNotification(this.read,this.modify,this.user,this.room, 
        `## Template Commands
        */template create <name> <template> * - create a template
        */template send <name> *   - send a template
        */template list*   - list all templates
        */template delete <name> * - delete a template
        */template edit <name> <new template>*   - edit a template
        `);
    }
    public async sayHello() {
        const message = `👋 Hey ${this.user.name}!  \n Use */template help* to see the list of available commands.`;
        await sendNotification(this.read,this.modify, this.user, this.room, message);
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