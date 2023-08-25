import { model, Schema } from 'mongoose';
import { IGuild } from '../struct/typings';

const schema = new Schema({
    id: { type: String, required: true },
});

export default model<IGuild>('guilds', schema);