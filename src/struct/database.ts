import mongoose from 'mongoose';
import Guild from '../models/guild';
import { ISchemas, IGuild } from './types';
import Client from './client';
import { Snowflake } from 'discord.js';

export default class Database {
    public schemas: ISchemas = {
        Guild: Guild
    };
    public client: Client;

    public constructor(client: Client) {
        this.client = client;

        mongoose.connection.on('connected', () => {
            client.logger.info('Connected to MongoDB', 'Database');
        });

        mongoose.connection.on('disconnected', () => {
            client.logger.warn('Disconnected from MongoDB', 'Database');
        });

        mongoose.connection.on('error', (err) => {
            client.logger.error(err.stack, 'Database');
        });
    };

    public async connect(): Promise<void> {
        await mongoose.connect(process.env.MONGOURL as string).catch((err) => {
            this.client.logger.fatal(err.stack, 'Database');
        });
    };

    public async disconnect(): Promise<void> {
        await mongoose.disconnect();
    };

    public async getGuild(id: Snowflake): Promise<IGuild> {
        const guild = await this.schemas.Guild.findOne({ id });
        if (guild) return guild;
        else return await (await this.schemas.Guild.create({ id })).save();
    };
};