import path from "node:path";

const isDev = process.argv[1].endsWith('.ts');
const baseDir = isDev ? 'src' : 'lib';
export const root = path.join(process.cwd(), baseDir);