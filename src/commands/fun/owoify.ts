import Command from '../../struct/command';
import Client from '../../struct/client';
import { ChatInputCommandInteraction, ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { IGuild } from '../../struct/typings';
import * as NekoNya from 'nekonya.js';

export default class OwoifyCommand extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'owoify',
            description: 'Make your text cute!',
            category: 'fun',
            usage: 'owoify <text>',
            ownerOnly: false,
            nsfw: false,
            options: [{
                name: 'text',
                description: 'The text to owoify',
                type: ApplicationCommandOptionType.String,
                required: true
            }],
            defer: false
        });
    };

    public async run(client: Client, ctx: ChatInputCommandInteraction<"cached">, data: IGuild): Promise<void> {
        const text = ctx.options.getString('text', true).replaceAll("\\n", "\n");
        const result = (await NekoNya.owoify(text)).replaceAll("\n", "\n> ");

        const embed = new EmbedBuilder()
            .setColor(client.config.colors.main)
            .setTimestamp()
            .setDescription(`> ${result}`)
            .setTitle(`${client.config.emotes.hug}・Owoify Result`)
            .setAuthor({ name: ctx.user.tag, iconURL: ctx.user.displayAvatarURL({ size: 1024, extension: 'webp' }) })
            .setFooter({ text: `Requested by ${ctx.user.tag}`, iconURL: client.user?.displayAvatarURL({ size: 1024, extension: 'webp' }) });
        await ctx.reply({
            embeds: [embed]
        });
    };
};