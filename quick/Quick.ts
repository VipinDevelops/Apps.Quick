import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { UIKitViewSubmitInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import {
    IAppAccessors,
    IAppInstallationContext,
    IConfigurationExtend,
    IConfigurationModify,
    IHttp,
    ILogger,
    IMessageBuilder,
    IMessageExtender,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { QuickCommand } from './commands/QuickCommand';
import { ExecuteViewSubmitHandler } from './handler/ExecuteViewSubmitHandler';
export class QuickApp extends App {

    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }
    public async extendConfiguration(
        configuration: IConfigurationExtend
    ): Promise<void> {
        const helloWorldCommand: QuickCommand = new
            QuickCommand(this);
        await configuration.slashCommands.provideSlashCommand(helloWorldCommand)
    }
    public async executeViewSubmitHandler(
        context: UIKitViewSubmitInteractionContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify
    ) {
        const handler = new ExecuteViewSubmitHandler(
            this,
            read,
            http,
            modify,
            persistence
        );
        return await handler.run(context);
    }
}
