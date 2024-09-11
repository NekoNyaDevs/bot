import Command from '../../struct/command';
import Client from '../../struct/client';
import { ChatInputCommandInteraction, ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { IGuild } from '../../struct/typings';
import * as NekoNya from 'nekonya.js';

export default class OwoifyCommand extends Command {
    constructor(client: Client) {
        super(client, {
            name: '8ball',
            description: 'Ask the magic 8ball a question!',
            category: 'fun',
            usage: '8ball <question> [cute]',
            ownerOnly: false,
            nsfw: false,
            options: [{
                name: 'question',
                description: 'Your question',
                type: ApplicationCommandOptionType.String,
                required: true
            }, {
                name: 'cute',
                description: 'Whether to make the answer cute',
                type: ApplicationCommandOptionType.Boolean,
                required: false
            }],
            defer: false
        });
    };

    public async run(client: Client, ctx: ChatInputCommandInteraction<"cached">, data: IGuild): Promise<void> {
        const text = ctx.options.getString('question', true).replaceAll("\\n", "\n");
        const result = await NekoNya.eightball(ctx.options.getBoolean('cute', false) || false);

        const embed = new EmbedBuilder()
            .setColor(client.config.colors.main)
            .setTimestamp()
            .setTitle(`${client.config.emotes.hug}・8ball Answer`)
            .addFields([
                {
                    name: `${client.config.emotes.question}・Question`,
                    value: `> ${text}`
                },
                {
                    name: `${client.config.emotes.eightball}・Answer`,
                    value: `> ${result}`
                }
            ])
            .setAuthor({ name: ctx.user.tag, iconURL: ctx.user.displayAvatarURL({ size: 1024, extension: 'webp' }) })
            .setFooter({ text: `Requested by ${ctx.user.tag}`, iconURL: client.user?.displayAvatarURL({ size: 1024, extension: 'webp' }) });
        await ctx.reply({
            embeds: [embed]
        });
    };
};