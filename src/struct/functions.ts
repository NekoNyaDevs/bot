import { APIStatusAnswer } from './types';
import ms from 'ms';
import axios from 'axios';

export function wait(time: number | string): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, typeof time === 'string' ? ms(time) : time);
    });
}

export function formatUptime(ms: number): string {
    const days = Math.floor(ms / 86400000);
    const hours = Math.floor(ms / 3600000) % 24;
    const minutes = Math.floor(ms / 60000) % 60;
    const seconds = Math.floor(ms / 1000) % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

export async function getAPIStatus(version: string = "v1"): Promise<APIStatusAnswer> {
    const beforeRequest = Date.now();
    const res = await axios.get(`https://nekonya.classydev.fr/api/${version}`).catch(() => {
        return {
            data: {
                status: 0,
                version: 'Unknown'
            }
        };
    });
    const afterRequest = Date.now();
    const latency = afterRequest - beforeRequest;
    let statusString;
    switch(res.data.status) {
        case 200:
            statusString = 'Online';
            break;
        case 503:
            statusString = 'Maintenance';
            break;
        case 502:
            statusString = 'Offline';
            break;
        case 0:
            statusString = 'Offline';
            break;
        default:
            statusString = 'Error';
            break;
    }

    return {
        status: res.data.status,
        version: res.data.version,
        statusString: statusString,
        latency: latency
    };
}