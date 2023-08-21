import * as Discord from 'discord.js';
import { Client, GatewayIntentBits } from 'discord.js';
import Command from './command';
import Event from './event';
import { readdirSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';
import Database from './database';
import { Logger } from '@classycrafter/super-logger';
import * as conf from '../config';

config();

export default class Bot extends Client {
    public commands: Discord.Collection<string, Command> = new Discord.Collection();
    public events: Discord.Collection<string, Event> = new Discord.Collection();
    public logger: Logger = new Logger({
        name: 'Nekonyan',
        writelogs: true,
        colored: true,
        dirpath: join(__dirname, '..', '..', 'logs'),
        tzformat: 24,
        timezone: 'Europe/Paris'
    });
    public database: Database = new Database(this);
    public config: typeof conf = conf;

    public constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
            ]
        });
    };

    private async _init(): Promise<void> {
        await this.database.connect();

        await this.loadCommands();
        await this.loadEvents();
    };

    public async start(): Promise<void> {
        await this._init();
        await this.login(process.env.TOKEN);
    };

    public async loadCommands(): Promise<void> {
        const commandPath = join(__dirname, '..', 'commands');

        for (const dir of readdirSync(commandPath)) {
            const commands = readdirSync(`${commandPath}/${dir}`).filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

            for (const file of commands) {
                const { default: Command } = await import(`${commandPath}/${dir}/${file}`);
                const command = new Command(this);

                this.commands.set(command.name, command);
            }
        }
    }

    public async loadEvents(): Promise<void> {
        const eventPath = join(__dirname, '..', 'events');
        const events = readdirSync(`${eventPath}`).filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

        for (const file of events) {
            const { default: Event } = await import(`${eventPath}/${file}`);
            const event = new Event(this);

            this.events.set(event.name, event);
            if (event.once) this.once(event.name, (...args) => event.run(this, ...args));
            else this.on(event.name, (...args) => event.run(this, ...args));
        }
    }

    makeReply(content: string, type: typeof this.config.emotes | string): string {
        // @ts-ignore
        return `${this.config.emotes[type]}・${content}`;
    }
};