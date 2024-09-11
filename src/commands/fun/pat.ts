import Command from '../../struct/command';
import Client from '../../struct/client';
import { ChatInputCommandInteraction, ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { IGuild } from '../../struct/typings';
import * as NekoNya from 'nekonya.js';

export default class KitsuneCommand extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'pat',
            description: 'Pat someone!',
            category: 'fun',
            usage: 'pat <user>',
            ownerOnly: false,
            nsfw: false,
            options: [{
                name: 'user',
                description: 'The user to pat',
                type: ApplicationCommandOptionType.User,
                required: true
            }],
            defer: false
        });
    };

    public async run(client: Client, ctx: ChatInputCommandInteraction<"cached">, data: IGuild): Promise<void> {
        const user = ctx.options.getUser('user', true);
        if (user.id === ctx.user.id) {
            await ctx.reply({
                content: client.makeReply('You can\'t pat yourself!', 'error')
            });
            return;
        }
        const pat = await NekoNya.pat();
        const embed = new EmbedBuilder()
            .setColor(client.config.colors.main)
            .setImage(pat)
            .setTimestamp()
            .setURL(pat)
            .setDescription(`> Oooh! So cute! ${ctx.user.toString()} patted ${user.toString()}!`)
            .setTitle(`${client.config.emotes.pat}・Pat!`)
            .setAuthor({ name: ctx.user.tag, iconURL: ctx.user.displayAvatarURL({ size: 1024, extension: 'webp' }) })
            .setFooter({ text: `Requested by ${ctx.user.tag}`, iconURL: client.user?.displayAvatarURL({ size: 1024, extension: 'webp' }) });
        await ctx.reply({
            embeds: [embed]
        });
    };
};