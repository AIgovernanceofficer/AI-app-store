import { openDB } from 'idb';
import type { IDBPDatabase } from 'idb';

export interface Transcription {
    id?: number;
    filename: string;
    text: string;
    date: Date;
}

const DATABASE_NAME = 'transcription-db';
const STORE_NAME = 'transcriptions';
const DB_VERSION = 1;

export async function initDB(): Promise<IDBPDatabase> {
    return openDB(DATABASE_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        },
    });
}

export async function saveTranscription(transcription: Omit<Transcription, 'id'>): Promise<number> {
    const db = await initDB();
    const result = await db.add(STORE_NAME, transcription);
    return result as number;
}

export async function getAllTranscriptions(): Promise<Transcription[]> {
    const db = await initDB();
    return db.getAll(STORE_NAME);
}

export async function deleteTranscription(id: number): Promise<void> {
    const db = await initDB();
    await db.delete(STORE_NAME, id);
}
