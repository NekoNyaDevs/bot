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
import Ptero from './ptero';
import { getAPIStatus, wait } from './functions';

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
    public ptero: Ptero = new Ptero(this);

    public constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
            ]
        });
    };

    private async _init(): Promise<void> {
        const results = await getAPIStatus("v1");
        if (results.status !== 200) {
            this.logger.fatal(`API is down!`, 'API');
        } else {
            this.logger.info(`API is up!`, 'API');
        }

        await this.database.connect();

        await this.loadCommands();
        await this.loadEvents();
    };

    public async start(): Promise<void> {
        this.logger.info(`Starting ${process.env.npm_package_name} on ${process.env.NODE_ENV} mode...`, 'Startup');
        await this._init();
        await this.login(process.env.TOKEN);
    };

    public async stop(): Promise<void> {
        await this.destroy();
        await this.database.disconnect();
    };

    public resetProperties(): void {
        this.commands = new Discord.Collection();
        this.events = new Discord.Collection();
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

    async synchronizeCommands(): Promise<void> {
        const commands = this.commands.map((command) => command.getPostableData());
        const devGuild = await this.guilds.fetch(this.config.devGuildId);
        if (process.env.NODE_ENV === 'development') {
            await this.application?.commands.set([]);
            await devGuild.commands.set(commands);
            return;
        } else {
            await devGuild.commands.set([]);
        }
        await this.application?.commands.set(commands);
        await wait('5s'); // wait to ensure the commands are set
        this.logger.info(`Commands have been synchronized!`, 'Commands');
        return;
    }
};