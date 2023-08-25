import {APIApplicationCommandOption, ColorResolvable} from 'discord.js';
import { Document } from 'mongoose';
import Guild from '../models/guild';

export type CommandOptions = APIApplicationCommandOption[] | undefined[] | Array<any>;

export interface IInfos {
    name: string;
    description: string;
    category: string;
    usage: string;
    ownerOnly: boolean;
    nsfw: boolean;
    options: CommandOptions;
    defer: boolean;
}

export interface IEventInfos {
    name: string;
    once: boolean;
}

export interface IGuild extends Document {
    id: string;
}

export interface ISchemas {
    Guild: typeof Guild;
}

export type SlashSyncOptions = {
    guildId?: string;
    debug?: boolean;
}

export interface Colors {
    main: ColorResolvable;
    error: ColorResolvable;
    success: ColorResolvable;
    bug: ColorResolvable;
    warning: ColorResolvable;
    info: ColorResolvable;
    loading: ColorResolvable;
    debug: ColorResolvable;
    secondary: ColorResolvable;
}

export interface Timing {
    time: number;
    name: string;
    interval?: NodeJS.Timeout;
    cb: () => Promise<void> | void;
}

export interface QueueOptions {
    interval: number;
}

export interface APIStatusAnswer {
    status: number;
    version: string;
    statusString: string;
}