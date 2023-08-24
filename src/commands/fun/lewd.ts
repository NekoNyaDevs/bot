import Command from '../../struct/command';
import Client from '../../struct/client';
import { ChatInputCommandInteraction, ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { IGuild } from '../../struct/typings';
import * as NekoNya from 'nekonya.js';

export default class NekoCommand extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'lewd',
            description: 'Get a random lewd image',
            category: 'fun',
            usage: 'lewd [number]',
            ownerOnly: false,
            nsfw: true,
            options: [{
                name: 'number',
                description: 'The number of images to get',
                type: ApplicationCommandOptionType.Number,
                required: false
            }],
            defer: false
        });
    };

    public async run(client: Client, ctx: ChatInputCommandInteraction, data: IGuild): Promise<void> {
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
            // @ts-ignore Ignoring for the moment until update to allow lewd endpoint
            const lewd: { url: string } = await NekoNya.get('random/lewd');
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.main)
                .setImage(lewd.url)
                .setTimestamp()
                .setURL(lewd.url)
                .setTitle(`${client.config.emotes.lewd}・Lewd! You pervert!`)
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