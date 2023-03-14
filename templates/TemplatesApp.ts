import {
    IAppAccessors,
    IConfigurationExtend,
    IEnvironmentRead,
    ILogger,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { TemplatesCommand } from './commands/TemplatesCommand';
export class TemplatesApp extends App {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
        //logging hello world 
        const log = this.getLogger();
        log.debug('Hello World!');
    }
    public async extendConfiguration(
        configuration: IConfigurationExtend
      ): Promise<void> {
        const helloWorldCommand: TemplatesCommand = new TemplatesCommand()
        await configuration.slashCommands.provideSlashCommand(helloWorldCommand)
      }
}
