import Command from '../../struct/command';
import Client from '../../struct/client';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { IGuild } from '../../struct/types';
import { version } from 'nekonya.js';
import { getAPIStatus, formatUptime } from '../../struct/functions';

export default class InfosCommand extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'infos',
            description: 'Get some informations about the bot',
            category: 'utils',
            usage: 'infos',
            ownerOnly: false,
            nsfw: false,
            options: [],
            defer: true
        });
    };

    public async run(client: Client, ctx: ChatInputCommandInteraction<"cached">, data: IGuild): Promise<void> {
        const name = client.user?.tag;
        const id = client.user?.id;
        const owners = client.config.owners.map((owner) => {
            const user = client.users.cache.get(owner);
            return user?.tag || 'An error occurred';
        }).join(', ');
        const guilds = client.guilds.cache.size;
        const users = client.users.cache.size;
        const channels = client.channels.cache.size;
        const commands = client.commands.size;
        const uptime = formatUptime(client.uptime || 0);
        const apiVersion = version;
        const apiStatus = (await getAPIStatus(apiVersion)).statusString;

        const embed = new EmbedBuilder()
            .setTitle(`${client.config.emotes.info}・Informations`)
            .setColor(client.config.colors.main)
            .setDescription(`> Hey there! I'm NekoNyan, a cute Discord bot made by NekoNyaDevs for the NekoNya project.\n> Here are some informations about me:`)
            .setTimestamp()
            .setAuthor({ name: ctx.user.tag, iconURL: ctx.user.displayAvatarURL({ size: 1024, extension: 'webp' }) })
            .setFooter({ text: `Requested by ${ctx.user.tag}`, iconURL: client.user?.displayAvatarURL({ size: 1024, extension: 'webp' }) })
            .addFields([
                {
                    name: `${client.config.emotes.pen}・Name`,
                    value: `> \`${name}\``,
                    inline: true
                },
                {
                    name: `${client.config.emotes.id}・ID`,
                    value: `> \`${id}\``,
                    inline: true
                },
                {
                    name: `${client.config.emotes.owner}・Owner(s)`,
                    value: `> \`${owners}\``,
                    inline: true
                },
                {
                    name: `${client.config.emotes.guilds}・Guilds`,
                    value: `> \`${guilds}\``,
                    inline: true
                },
                {
                    name: `${client.config.emotes.silhouettes}・Users`,
                    value: `> \`${users}\``,
                    inline: true
                },
                {
                    name: `${client.config.emotes.channels}・Channels`,
                    value: `> \`${channels}\``,
                    inline: true
                },
                {
                    name: `${client.config.emotes.commands}・Commands`,
                    value: `> \`${commands}\``,
                    inline: true
                },
                {
                    name: `${client.config.emotes.time}・Uptime`,
                    value: `> \`${uptime}\``,
                    inline: true
                },
                {
                    name: `${client.config.emotes.api}・API`,
                    value: `> **Status**: \`${apiStatus}\`\n> **Version**: \`${apiVersion}\`\n> **Latency**: \`${(await getAPIStatus(apiVersion)).latency}ms\``,
                    inline: true
                }
            ]);

        await ctx.editReply({
            embeds: [embed]
        });
    };
};