import Command from '../../struct/command';
import Client from '../../struct/client';
import {ChatInputCommandInteraction} from 'discord.js';
import {IGuild} from '../../struct/typings';

export default class HelloCommand extends Command {
    public constructor(client: Client) {
        super(client, {
            name: 'hello',
            description: 'Say hello to the bot',
            category: 'utils',
            usage: 'hello',
            ownerOnly: false,
            nsfw: false,
            options: [],
            defer: false
        });
    };

    public async run(client: Client, ctx: ChatInputCommandInteraction, data: IGuild): Promise<void> {
        await ctx.reply({
            content: `Hello, ${ctx.user}!`
        });
        return;
    };
};