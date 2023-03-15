import { IRead, IModify, IHttp, IPersistence, IMessageBuilder, IModifyCreator } from "@rocket.chat/apps-engine/definition/accessors";
import { IMessage } from "@rocket.chat/apps-engine/definition/messages";
// import { createTemplateModal } from "../lib/createTemplateModal";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { ISlashCommand, ISlashCommandPreview, ISlashCommandPreviewItem, SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import {sendMessage} from "../lib/sendMessage";
import { TemplatesApp } from "../TemplatesApp";
import { CommandUtility } from "../lib/commandUtility";

export class TemplateCommand implements ISlashCommand{
  public constructor(private readonly app:TemplatesApp) {}
    public command = 'template'
    public i18nDescription = 'using template command'
    public providesPreview = false
    public i18nParamsExample = ''
  
    public async executor(
      context: SlashCommandContext,
      read: IRead,
      modify: IModify,
      http: IHttp,
      persistence: IPersistence
    ): Promise<void> {

      // const [subcommand] = context.getArguments(); 
      const command = context.getArguments();
      // const triggerId = context.getTriggerId();
      const sender = context.getSender() //User who sent the message
      const bot: IUser = (await read.getUserReader().getAppUser()) as IUser //bot user
      const room: IRoom = context.getRoom()

      if(!Array.isArray(command)){
        return;
    }

    const commandUtility = new CommandUtility(
        {
            sender: sender,
            room: room,
            command: command,
            bot: bot,
            context: context,
            read: read,
            modify: modify,
            http: http,
            persistence: persistence,
            app: this.app
        }
    );

    commandUtility.resolveCommand();



    //   const data = {
    //   room: (context.getRoom() as any).value,
    //   // threadId: context.getThreadId(), 
    // };

    //// open createTemplateModal
  //   if (triggerId) {
  //     try {
  //         const modal = await createTemplateModal({ persistence: persis, modify, data });
  //         await modify.getUiController().openModalView(modal, { triggerId }, context.getSender());
  //     } catch (e) {
  //         throw new Error(`Unable to open poll modal. Error ${e}`);
  //     }
  // }

    // switch (subcommand) {       
    //     case 'help':
    //       sendMessage(modify, room, bot, `## Template Management Commands:
    //       */templates add* - Add a new template to the system.
    //       */templates delete* - Delete an existing template from the system.
    //       */templates edit* - Edit an existing template in the system.
    //       */templates help* - Show this help message.
    //       */templates sender* - Send a template to a recipient.
    //       */templates show* - Show a list of all available templates.
    // `)
    //    break;
    //   case 'add': 
    //     // addTemplates(read, modify, http, persis, context)
    //       if (triggerId) {
    //           try {
    //               const modal = await createTemplateModal({ persistence: persis, modify, data });
    //               await modify.getUiController().openModalView(modal, { triggerId }, context.getSender());
    //           } catch (e) {
    //               throw new Error(`Unable to open poll modal. Error ${e}`);
    //           }
    //       }
    //     break;
        
    //     default: 
    //         throw new Error('Error!');
    // }




    }
}