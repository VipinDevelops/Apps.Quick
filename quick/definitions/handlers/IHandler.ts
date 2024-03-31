import { ICommandUtilityParams } from "../command/ICommandUtility";

export interface IHandler extends Omit<ICommandUtilityParams, "params"> {}

export type IHanderParams = Omit<ICommandUtilityParams, "params">;
