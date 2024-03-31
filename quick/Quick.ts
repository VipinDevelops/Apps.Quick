import { App } from "@rocket.chat/apps-engine/definition/App";
import { IAppInfo } from "@rocket.chat/apps-engine/definition/metadata";
import {
    IUIKitResponse,
    UIKitActionButtonInteractionContext,
    UIKitBlockInteractionContext,
    UIKitViewCloseInteractionContext,
    UIKitViewSubmitInteractionContext,
} from "@rocket.chat/apps-engine/definition/uikit";
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
import {
    IUIActionButtonDescriptor,
    UIActionButtonContext,
} from "@rocket.chat/apps-engine/definition/ui";
import { QuickCommand } from "./src/commands/QuickCommand";
import { ExecuteActionButtonHandler } from "./src/handler/ExecuteActionButtonHandler";
import { ExecuteBlockActionHandler } from "./src/handler/ExecuteBlockActionHandler";
import { ExecuteViewSubmitHandler } from "./src/handler/ExecuteViewSubmitHandler";
import { ElementBuilder } from "./src/lib/ElementBuilder";
import { BlockBuilder } from "./src/lib/BlockBuilder";
import { ActionButton } from "./src/enum/ActionButtons";
import { settings } from "./src/settings/settings";
import { IAppUtils } from "./src/lib/IAppUtils";
import { ExecuteViewClosedHandler } from "./src/handler/ExecuteViewClosedHandler";
export class QuickApp extends App {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }
    private elementBuilder: ElementBuilder;
    private blockBuilder: BlockBuilder;
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
    public async initialize(
        configurationExtend: IConfigurationExtend,
        environmentRead: IEnvironmentRead
    ): Promise<void> {
        this.elementBuilder = new ElementBuilder(this.getID());
        this.blockBuilder = new BlockBuilder(this.getID());

        const AskAI: IUIActionButtonDescriptor = {
            actionId: ActionButton.ASK_AI,
            labelI18n: ActionButton.ASK_AI_LABEL,
            context: UIActionButtonContext.MESSAGE_ACTION,
        };

        const quickCommand: QuickCommand = new QuickCommand(this);
        await configurationExtend.slashCommands.provideSlashCommand(
            quickCommand
        );

        await Promise.all(
            settings.map((setting) => {
                configurationExtend.settings.provideSetting(setting);
            })
        );

        configurationExtend.ui.registerButton(AskAI);
    }
    public getUtils(): IAppUtils {
        return {
            elementBuilder: this.elementBuilder,
            blockBuilder: this.blockBuilder,
        };
    }
    public async executeActionButtonHandler(
        context: UIKitActionButtonInteractionContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify
    ): Promise<IUIKitResponse> {
        const handler = new ExecuteActionButtonHandler(
            this,
            read,
            http,
            persistence,
            modify,
            context
        );
        return await handler.handleActions();
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
            persistence,
            modify,
            context
        );

        return await handler.handleActions();
    }
    public async executeViewClosedHandler(
        context: UIKitViewCloseInteractionContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify
    ): Promise<IUIKitResponse> {
        const handler = new ExecuteViewClosedHandler(
            this,
            read,
            http,
            persistence,
            modify,
            context
        );

        return await handler.handleActions();
    }
}
