import {
    IRead,
    IModify,
    IHttp,
    IPersistence,
} from "@rocket.chat/apps-engine/definition/accessors";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { sendHelperMessageOnInstall, sendHelperNotification, sendMessage } from "./sendMessage";
import { sendNotification } from "./sendNotification";
import { ListHandler } from "../handler/ListHandler";
import { QuickApp } from "../../Quick";
import { CreateHandler } from "../handler/CreateHandler";
import { ExecutorProps } from "../../definitions/ExecutorProps";

export class CommandUtility implements ExecutorProps {
    user: IUser;
    room: IRoom;
    command: string[];
    bot: IUser;
    context: SlashCommandContext;
    read: IRead;
    modify: IModify;
    http: IHttp;
    persistence: IPersistence;
    app: QuickApp;

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
        CreateHandler(
            this.read,
            this.context,
            this.app,
            this.persistence,
            this.http,
            this.room,
            this.modify
        );
    }
    public async sendTemplate(name: string) { }

    public async listTemplates() {
        ListHandler(
            this.read,
            this.context,
            this.app,
            this.persistence,
            this.http,
            this.room,
            this.modify
        );
    }
    public async help() {
        // sendNotification(
        //     this.read,
        //     this.modify,
        //     this.user,
        //     this.room,
        //     `## Quick Reply Commands
        // */quick create* - create a reply
        // */quick list*   - list all reply
        // `
        // );
        sendHelperNotification(
            this.read,
            this.modify,
            this.user,
            this.room
        );
        }
    public async sayHello() {
        const message = `👋 Hey ${this.user.name}!  \n Use */quick help* to see the list of available commands.`;
        await sendNotification(
            this.read,
            this.modify,
            this.user,
            this.room,
            message
        );
    }

    public async resolveCommand() {
        switch (this.command[0]) {
            case "create":
                this.createTemplate();
                break;
            case "list":
                this.listTemplates();
                break;
            case "help":
                this.help();
                break;
            default:
                this.sayHello();
                break;
        }
    }
}
