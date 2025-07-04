import Command from '../../struct/command';
import Client from '../../struct/client';
import { ChatInputCommandInteraction, ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { IGuild } from '../../struct/types';
import * as NekoNya from 'nekonya.js';

export default class HugCommand extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'hug',
            description: 'hug someone!',
            category: 'fun',
            usage: 'hug <user>',
            ownerOnly: false,
            nsfw: false,
            options: [{
                name: 'user',
                description: 'The user to hug',
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
                content: client.makeReply('You can\'t hug yourself!', 'error')
            });
            return;
        }
        const hug = await NekoNya.hug();
        const embed = new EmbedBuilder()
            .setColor(client.config.colors.main)
            .setImage(hug)
            .setTimestamp()
            .setURL(hug)
            .setDescription(`> Ooooww!! Sweet! ${ctx.user.toString()} just hugged ${user.toString()}!`)
            .setTitle(`${client.config.emotes.hug}・Hug!`)
            .setAuthor({ name: ctx.user.tag, iconURL: ctx.user.displayAvatarURL({ size: 1024, extension: 'webp' }) })
            .setFooter({ text: `Requested by ${ctx.user.tag}`, iconURL: client.user?.displayAvatarURL({ size: 1024, extension: 'webp' }) });
        await ctx.reply({
            embeds: [embed]
        });
    };
};