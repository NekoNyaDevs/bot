import Command from '../../struct/command';
import Client from '../../struct/client';
import { ChatInputCommandInteraction, ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { IGuild } from '../../struct/types';
import * as NekoNya from 'nekonya.js';

export default class KissCommand extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'kiss',
            description: 'kiss someone!',
            category: 'fun',
            usage: 'kiss <user>',
            ownerOnly: false,
            nsfw: false,
            options: [{
                name: 'user',
                description: 'The user to kiss',
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
                content: client.makeReply('You can\'t kiss yourself!', 'error')
            });
            return;
        }
        const kiss = await NekoNya.kiss();
        const embed = new EmbedBuilder()
            .setColor(client.config.colors.main)
            .setImage(kiss)
            .setTimestamp()
            .setURL(kiss)
            .setDescription(`> Oh my-!! ${ctx.user.toString()} just kissed ${user.toString()}!`)
            .setTitle(`${client.config.emotes.kiss}・Kiss!`)
            .setAuthor({ name: ctx.user.tag, iconURL: ctx.user.displayAvatarURL({ size: 1024, extension: 'webp' }) })
            .setFooter({ text: `Requested by ${ctx.user.tag}`, iconURL: client.user?.displayAvatarURL({ size: 1024, extension: 'webp' }) });
        await ctx.reply({
            embeds: [embed]
        });
    };
};