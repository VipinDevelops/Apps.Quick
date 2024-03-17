import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { IUIKitResponse, UIKitActionButtonInteractionContext, UIKitBlockInteractionContext, UIKitViewSubmitInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import {
    IAppAccessors,
    IAppInstallationContext,
    IConfigurationExtend,
    IConfigurationModify,
    IEnvironmentRead,
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
import { IUIActionButtonDescriptor, UIActionButtonContext } from '@rocket.chat/apps-engine/definition/ui';
import { ExecuteButtonActionHandler } from './handler/ExecuteActionButtonHandler';
import { ExecuteBlockActionHandler } from './handler/ExecuteBlockActionHandler';
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
    public async initialize(configurationExtend: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
        const AskAI: IUIActionButtonDescriptor = {
            actionId: "ask-ai",
            labelI18n: "ask_ai",
            context: UIActionButtonContext.MESSAGE_ACTION,
        }

        configurationExtend.ui.registerButton(AskAI);
    }
    public async executeActionButtonHandler(
        context: UIKitActionButtonInteractionContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify
    ): Promise<IUIKitResponse> {

        const handler = new ExecuteButtonActionHandler(
            this,
            read,
            http,
            modify,
            persistence
        )
        return await handler.run(context)
    }
    public async executeBlockActionHandler(
        context: UIKitBlockInteractionContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify
    ): Promise<IUIKitResponse> {
        const handler = new ExecuteBlockActionHandler(
            this,
            read,
            http,
            modify,
            persistence
        );
        return await handler.run(context);
    }
}
