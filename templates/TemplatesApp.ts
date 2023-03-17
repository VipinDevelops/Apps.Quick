import {
    IAppAccessors,
    IConfigurationExtend,
    IEnvironmentRead,
    ILogger,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { TemplateCommand } from './commands/TemplateCommand';
export class TemplatesApp extends App {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }
    public async extendConfiguration(
        configuration: IConfigurationExtend
      ): Promise<void> {
        const helloWorldCommand: TemplateCommand = new 
        TemplateCommand(this);
        await configuration.slashCommands.provideSlashCommand(helloWorldCommand)
      }
}
