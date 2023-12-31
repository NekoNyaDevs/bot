import Client from './client';
import * as Discord from 'discord.js';
import { SlashSyncOptions, APIStatusAnswer } from './typings';
import ms from 'ms';
import axios from 'axios';

export async function slashsync(client: Client, options: SlashSyncOptions = {
    debug: false,
    guildId: undefined
}) {
    const log = (message: string) => {
        return options.debug && client.logger.debug(message, "SlashSync");
    };

    const ready = client.readyAt ? Promise.resolve() : new Promise(resolve => client.once('ready', resolve));
    await ready;
    const currentCommands = await client.application?.commands?.fetch({ guildId: options.guildId }) ?? new Discord.Collection();

    log(`Synchronizing commands...`);
    log(`${currentCommands.size} commands are actually posted.`);

    const newCommands = client.commands.filter((command) => !currentCommands.some((c) => c.name === command.name));
    for (let newCommand of newCommands.values()) {
        const postableData = newCommand.getPostableData();
        await client.application?.commands?.create(postableData, options.guildId);
    }

    log(`${newCommands.size} commands ${newCommands.size > 1 ? 'have' : 'has'} been created.`);

    const deletedCommands = currentCommands.filter((command) => !client.commands.some((c) => c.name === command.name)).toJSON();
    for (let deletedCommand of deletedCommands) {
        await deletedCommand.delete().catch(err => {
            log(`Unable to delete command ${deletedCommand.name}. (InternalErr)`);
        });
    }

    log(`${deletedCommands.length} ${deletedCommands.length > 1 ? 'have' : 'has'} been deleted.`);

    const updatedCommands = client.commands.filter((command) => currentCommands.some((c) => c.name === command.name));
    let updatedCommandCount = 0;
    for (let updatedCommand of updatedCommands.values()) {
        const newCommand = updatedCommand;
        const previousCommand = currentCommands.find((c) => c.name === newCommand.name);
        let modified = false;
        if (previousCommand?.description !== newCommand.description) modified = true;
        if (!Discord.ApplicationCommand.optionsEqual(previousCommand?.options ?? [], newCommand.getPostableData().options ?? [])) modified = true;
        if (modified) {
            await previousCommand?.edit(newCommand);
            updatedCommandCount++;
        }
    }

    log(`${updatedCommandCount} ${updatedCommandCount > 1 ? 'have' : 'has'} been updated.`);
    log(`Successfully synchronized commands!`);

    return {
        currentCommandCount: currentCommands.size,
        newCommandCount: newCommands.size,
        deletedCommandCount: deletedCommands.length,
        updatedCommandCount
    };
}

export function wait(time: number | string): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, typeof time === 'string' ? ms(time) : time);
    });
}

export function formatUptime(ms: number): string {
    const days = Math.floor(ms / 86400000);
    const hours = Math.floor(ms / 3600000) % 24;
    const minutes = Math.floor(ms / 60000) % 60;
    const seconds = Math.floor(ms / 1000) % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

export async function getAPIStatus(version: string): Promise<APIStatusAnswer> {
    const res = await axios.get(`https://nekonya.classydev.fr/api/${version}`).catch(() => {
        return {
            data: {
                status: 0,
                version: 'Unknown'
            }
        };
    });
    let statusString;
    switch(res.data.status) {
        case 200:
            statusString = 'Online';
            break;
        case 503:
            statusString = 'Maintenance';
            break;
        case 502:
            statusString = 'Offline';
            break;
        case 0:
            statusString = 'Offline';
            break;
        default:
            statusString = 'Error';
            break;
    }

    return {
        status: res.data.status,
        version: res.data.version,
        statusString: statusString
    };
}