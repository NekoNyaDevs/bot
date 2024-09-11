import Event from '../struct/event';
import Client from '../struct/client';
import { ChatInputCommandInteraction } from 'discord.js';

export default class InteractionCreateEvent extends Event {
    public constructor(client: Client) {
        super(client, {
            name: 'interactionCreate',
            once: false
        });
    };

    public async run(client: Client, ctx: ChatInputCommandInteraction): Promise<void> {
        if (!ctx.isCommand()) return;
        if (!ctx.inGuild() || !ctx.guild) return;
        if (!ctx.inCachedGuild()) return;
        if (!client.isReady()) return;
        if (!ctx.channel) return;
        if (!ctx.channel.isTextBased()) return;
        if (ctx.channel.isDMBased()) return;

        const data = await client.database.getGuild(ctx.guild.id);
        const command = client.commands.get(ctx.commandName);
        if (!command) {
            await ctx.reply({
                content: client.makeReply("That command does not exist.", "error"),
                ephemeral: true
            });
            try {
                await client.application.commands.delete(ctx.commandId);
            } catch(e) {
                await ctx.guild.commands.delete(ctx.commandId).catch(() => {
                    return;
                });
            }
            return;
        }

        if (command.ownerOnly && !client.config.owners.includes(ctx.user.id)) {
            await ctx.reply({
                content: client.makeReply("You do not have permission to execute this command.", "error"),
                ephemeral: true
            });
            return;
        }

        if (command.nsfw && !ctx.channel.isThread() && !ctx.channel?.nsfw) {
            await ctx.reply({
                content: client.makeReply("This command can only be executed in a NSFW channel.", "error"),
                ephemeral: true
            });
            return;
        }

        if (command.defer) {
            await ctx.deferReply();
        }

        try {
            await command.run(client, ctx, data);
        } catch(e) {
            await command.onError(ctx, e as Error);
        }
    };
};