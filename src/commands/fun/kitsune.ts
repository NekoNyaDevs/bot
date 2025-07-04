import Command from '../../struct/command';
import Client from '../../struct/client';
import { ChatInputCommandInteraction, ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { IGuild } from '../../struct/types';
import * as NekoNya from 'nekonya.js';

export default class KitsuneCommand extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'kitsune',
            description: 'Get a random kitsune image',
            category: 'fun',
            usage: 'kitsune [number]',
            ownerOnly: false,
            nsfw: false,
            options: [{
                name: 'number',
                description: 'The number of images to get',
                type: ApplicationCommandOptionType.Number,
                required: false
            }],
            defer: false
        });
    };

    public async run(client: Client, ctx: ChatInputCommandInteraction<"cached">, data: IGuild): Promise<void> {
        const number = ctx.options.getNumber('number') || 1;
        if (number > 3) {
            await ctx.reply({
                content: client.makeReply('You can\'t get more than 3 images at once!', 'error')
            });
            return;
        }
        if (number < 1) {
            await ctx.reply({
                content: client.makeReply('You can\'t get less than 1 image!', 'error')
            });
            return;
        }
        for (let i = 0; i < number; i++) {
            const kitsune = await NekoNya.kitsune();
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.main)
                .setImage(kitsune)
                .setTimestamp()
                .setURL(kitsune)
                .setTitle(`${client.config.emotes.fox}・Kitsune!`)
                .setAuthor({ name: ctx.user.tag, iconURL: ctx.user.displayAvatarURL({ size: 1024, extension: 'webp' }) })
                .setFooter({ text: `Requested by ${ctx.user.tag}`, iconURL: client.user?.displayAvatarURL({ size: 1024, extension: 'webp' }) });
            if (i === 0) {
                await ctx.reply({
                    embeds: [embed]
                });
            } else await ctx.channel?.send({
                embeds: [embed]
            });
        }
    };
};