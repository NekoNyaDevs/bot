import Command from '../../struct/command';
import Client from '../../struct/client';
import { ChatInputCommandInteraction, ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { IGuild } from '../../struct/typings';
import * as NekoNya from 'nekonya.js';

export default class KitsuneCommand extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'slap',
            description: 'Slap someone!',
            category: 'fun',
            usage: 'slap <user>',
            ownerOnly: false,
            nsfw: false,
            options: [{
                name: 'user',
                description: 'The user to slap',
                type: ApplicationCommandOptionType.User,
                required: true
            }],
            defer: false
        });
    };

    public async run(client: Client, ctx: ChatInputCommandInteraction, data: IGuild): Promise<void> {
        const user = ctx.options.getUser('user', true);
        if (user.id === ctx.user.id) {
            await ctx.reply({
                content: client.makeReply('You can\'t slap yourself!', 'error')
            });
            return;
        }
        const slap = await NekoNya.slap();
        const embed = new EmbedBuilder()
            .setColor(client.config.colors.main)
            .setImage(slap)
            .setTimestamp()
            .setURL(slap)
            .setDescription(`> Ouchie!! ${ctx.user.toString()} slapped ${user.toString()}!`)
            .setTitle(`${client.config.emotes.slap}・Slap!`)
            .setAuthor({ name: ctx.user.tag, iconURL: ctx.user.displayAvatarURL({ size: 1024, extension: 'webp' }) })
            .setFooter({ text: `Requested by ${ctx.user.tag}`, iconURL: client.user?.displayAvatarURL({ size: 1024, extension: 'webp' }) });
        await ctx.reply({
            embeds: [embed]
        });
    };
};