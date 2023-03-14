import { IRead, IModify, IHttp, IPersistence, IMessageBuilder, IModifyCreator } from "@rocket.chat/apps-engine/definition/accessors";
import { IMessage } from "@rocket.chat/apps-engine/definition/messages";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { ISlashCommand, ISlashCommandPreview, ISlashCommandPreviewItem, SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import {sendMessage} from "../lib/sendMessage";

export class TemplatesCommand implements ISlashCommand{
    public command = 'template'
    public i18nDescription = ''
    public providesPreview = false
    public i18nParamsExample = ''
  
    public async executor(
      context: SlashCommandContext,
      read: IRead,
      modify: IModify,
      http: IHttp,
      persis: IPersistence
    ): Promise<void> {
      const [subcommand] = context.getArguments(); 

      const user = context.getSender() //User who sent the message
      const Bot: IUser = (await read.getUserReader().getAppUser()) as IUser //Bot user
      const room: IRoom = context.getRoom()
  
      if (!subcommand) { 
      sendMessage(modify, room, Bot, 'To use template message app use slash command `/template {name of template}` ')
    }    
    switch (subcommand) { 
        case 'hello': 
            sendMessage(modify, room, user, 'Hello, World!')
            break;

        case 'message': // [6]
            sendMessage(modify, room, user, 'This is first Test message of my App!')
            break;

        default: 
            throw new Error('Error!');
    }
    }
}