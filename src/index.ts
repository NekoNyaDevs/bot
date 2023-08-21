import Client from './struct/client';
import { existsSync, mkdirSync } from 'fs';

if (!existsSync('logs')) {
    mkdirSync('logs');
}

const client = new Client();
client.start();

if (process.env.NODE_ENV === 'development') {
    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });
    process.on('uncaughtException', (error) => {
        console.error('Uncaught Exception:', error);
    });
    process.on('warning', (warning) => {
        console.warn(warning);
    });
}