import { Storage, StoragePlugin } from '@capacitor/storage';

const storage: StoragePlugin = Storage;

var curr_user;
var curr_pswd;

export const setCurrentAccount = async (email: string, user: string, pswd: string) => {
    await storage.set({
        key: 'account',
        value: JSON.stringify('{"email":"' + email + '","user":"' + user + '","pswd":"' + pswd + '"}')
    });
    return getCurrentAccount();
}

export const getCurrentAccount = async () => {
    const { value } = await storage.get({ key: 'account' });
    let account = JSON.parse(value as string);
    return account;
}

export const onLoad = async () => {
    const { value } = await storage.get({ key: 'account' });
    let account = JSON.parse(value as string);
    console.log(account)
    // console.log(account.user)
    // console.log(account.pswd)
    // curr_user = account.user;
    // curr_pswd = account.pswd;
}

export const clearStorage = async () => {
    storage.clear();
}