import { Storage, StoragePlugin } from '@capacitor/storage';

const storage: StoragePlugin = Storage;

export var curr_email: string;
export var curr_user: string;
export var curr_pswd: string;

export const setCurrentAccount = async (email: string, user: string, pswd: string) => {
    await storage.set({
        key: 'account',
        value: JSON.stringify('{"email":"' + email + '","user":"' + user + '","pswd":"' + pswd + '"}')
    });
    curr_email = email;
    curr_user = user;
    curr_pswd = pswd;
    return getCurrentAccount();
}

export const getCurrentAccount = async () => {
    const { value } = await storage.get({ key: 'account' });
    let account = JSON.parse(value as string);
    return account;
}

export const onLoad = async () => {
    try {
        const { value } = await storage.get({ key: 'account' });
        let acc = JSON.parse(value as string);
        let account = JSON.parse(acc);

        curr_email = account.email;
        curr_user = account.user;
        curr_pswd = account.pswd;
    } catch (e) {
        console.error(e);
    }
}

export const clearStorage = async () => {
    storage.clear();
}