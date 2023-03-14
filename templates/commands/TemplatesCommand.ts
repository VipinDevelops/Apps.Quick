import { IRead, IModify, IHttp, IPersistence, IMessageBuilder, IModifyCreator } from "@rocket.chat/apps-engine/definition/accessors";
import { IMessage } from "@rocket.chat/apps-engine/definition/messages";
import { createTemplateModal } from "../lib/createTemplateModal";
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
      const triggerId = context.getTriggerId();
      const user = context.getSender() //User who sent the message
      const Bot: IUser = (await read.getUserReader().getAppUser()) as IUser //Bot user
      const room: IRoom = context.getRoom()

      const data = {
      room: (context.getRoom() as any).value,
      // threadId: context.getThreadId(), 
    };

    if (triggerId) {
      try {
          const modal = await createTemplateModal({ persistence: persis, modify, data });
          await modify.getUiController().openModalView(modal, { triggerId }, context.getSender());
      } catch (e) {
          throw new Error(`Unable to open poll modal. Error ${e}`);
      }
  }
    switch (subcommand) { 
        case 'help':
          sendMessage(modify, room, Bot, 'To use template message app use slash command `/template {name of template}` ')
        break;
        default: 
            throw new Error('Error!');
    }
    }
}