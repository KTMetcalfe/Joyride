import { Storage, StoragePlugin } from '@capacitor/storage';

const storage: StoragePlugin = Storage;

export const setCurrentUser = async (user: string) => {
    await storage.set({
        key: 'user',
        value: JSON.stringify(user)
    });
    console.log(await storage.get({ key: 'user' }));
}

export const getCurrentUser = async () => {
    const { value } = await storage.get({ key: 'user' });
    let user = JSON.parse(value as string);
    return user;
}

export const clearStorage = async () => {
    storage.clear();
}