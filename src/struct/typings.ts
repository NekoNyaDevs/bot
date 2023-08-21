import { APIApplicationCommandOption } from 'discord.js';
import { Document } from 'mongoose';
import Guild from '../models/guild';

export type CommandOptions = APIApplicationCommandOption | undefined;

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