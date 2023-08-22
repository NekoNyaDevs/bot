import Command from '../../struct/command';
import Client from '../../struct/client';
import {ChatInputCommandInteraction, ApplicationCommandOptionType, EmbedBuilder, ColorResolvable} from 'discord.js';
import { IGuild } from '../../struct/typings';

export default class HelpCommand extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'help',
            description: 'Get help about a command or general help',
            category: 'utils',
            usage: 'help [command]',
            ownerOnly: false,
            nsfw: false,
            options: [
                {
                    name: 'command',
                    description: 'The command you want to get help from',
                    type: ApplicationCommandOptionType.String,
                    required: false
                }
            ],
            defer: true
        });
    };

    public async run(client: Client, ctx: ChatInputCommandInteraction, data: IGuild): Promise<void> {
        const command = ctx.options.getString('command');
        if (command) {
            const cmd = client.commands.get(command);
            if (!cmd) {
                await ctx.editReply({
                    content: `The command \`${command}\` doesn't exist.`
                });
                return;
            }

            const embed = new EmbedBuilder()
                .setTitle(`${client.config.emotes.info}・Help for ${cmd.name}`)
                .setDescription(`> ${cmd.description.split('\n').join('\n> ')}\n\n> **Usage**: \`${cmd.usage}\`\n> **Category**: \`${cmd.category}\`\n> **Owner Only**: ${cmd.ownerOnly ? '`Yes`' : '`No`'}\n> **NSFW**: ${cmd.nsfw ? '`Yes' : '`No`'}`)
                .setColor(client.config.colors.main)
                .setTimestamp()
                .setAuthor({ name: ctx.user.tag, iconURL: ctx.user.displayAvatarURL({ size: 1024, extension: 'webp' }) })
                .setFooter({ text: `Requested by ${ctx.user.tag}`, iconURL: client.user?.displayAvatarURL({ size: 1024, extension: 'webp' }) });

            await ctx.editReply({
                embeds: [embed]
            });
        } else {
            const utils = client.commands.filter((cmd) => cmd.category === 'utils')?.map((cmd) => `\`${cmd.name}\``).join(', ') || '*Coming soon!*';
            const fun = client.commands.filter((cmd) => cmd.category === 'fun')?.map((cmd) => `\`${cmd.name}\``).join(', ') || '*Coming soon!*';
            const admin = client.commands.filter((cmd) => cmd.category === 'admin')?.map((cmd) => `\`${cmd.name}\``).join(', ') || '*Coming soon!*';

            const embed = new EmbedBuilder()
                .setTitle(`${client.config.emotes.info}・Help`)
                .setDescription(`> To get help about a specific command, run \`/help <command>\`.\n> To execute a command, run \`/command\`.`)
                .addFields([
                    {
                        name: `${client.config.emotes.utils}・Utils`,
                        value: `> ${utils}`,
                        inline: true
                    },
                    {
                        name: `${client.config.emotes.fun}・Fun`,
                        value: `> ${fun}`,
                        inline: true
                    },
                    {
                        name: `${client.config.emotes.admin}・Admin`,
                        value: `> ${admin}`,
                        inline: true
                    }
                ])
                .setColor(client.config.colors.main)
                .setTimestamp()
                .setAuthor({ name: ctx.user.tag, iconURL: ctx.user.displayAvatarURL({ size: 1024, extension: 'webp' }) })
                .setFooter({ text: `Requested by ${ctx.user.tag}`, iconURL: client.user?.displayAvatarURL({ size: 1024, extension: 'webp' }) });

            await ctx.editReply({
                embeds: [embed]
            });
        }
    };
};