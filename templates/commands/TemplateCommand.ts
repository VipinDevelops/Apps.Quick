import { IRead, IModify, IHttp, IPersistence, } from "@rocket.chat/apps-engine/definition/accessors";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { ISlashCommand, SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
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

      const command = context.getArguments();
      const user:IUser = context.getSender() //User who sent the message
      const bot: IUser = (await read.getUserReader().getAppUser()) as IUser //bot user
      const room: IRoom = context.getRoom()

      if(!Array.isArray(command)){
        return;
    }

    const commandUtility = new CommandUtility(
        {
            user: user,
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
    }
}