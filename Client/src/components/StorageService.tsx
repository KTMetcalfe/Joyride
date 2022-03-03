import { Storage, StoragePlugin } from '@capacitor/storage';

const storage: StoragePlugin = Storage;

export var refreshQuery: boolean = false;
export const setRefreshQuery = (value: boolean) => {
  refreshQuery = value;
}

export var filter: object = {
  "year_start": 0,
  "year_end": 0
};
export const setFilter = (value: object) => {
  filter = value;
}
export var resetQuery: boolean = false;
export const setResetQuery = (value: boolean) => {
  resetQuery = value;
}

export var curr_email: string = '';
export var curr_user: string = '';
export var curr_pswd: string = '';
export var curr_priv: number = 0;

export const setCurrentAccount = async (email: string, user: string, pswd: string, priv: number) => {
    await storage.set({
        key: 'account',
        value: JSON.stringify('{"email":"' + email + '","user":"' + user + '","pswd":"' + pswd + '","priv":"' + priv + '"}')
    });
    curr_email = email;
    curr_user = user;
    curr_pswd = pswd;
    curr_priv = priv;
    return getCurrentAccount();
}

export const getCurrentAccount = async () => {
    const { value } = await storage.get({ key: 'account' });
    let account = JSON.parse(value as string);
    return account;
}

export const onLoad = async () => {
    try {
        console.log("Checking user...");

        const { value } = await storage.get({ key: 'account' });

        let acc = JSON.parse(value as string);
        let account = JSON.parse(acc);

        if (account === null) {
            throw new Error("No account in storage")
        }

        await fetch('https://api.kianm.net/index.php/login/validate', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Authorization': 'Basic ' + btoa(account.user + ':' + account.pswd)
            }
        })
            .then(e => e.json())
            .then(result => {
                if (result.isVerified === true) {
                    curr_email = result.email;
                    curr_user = account.user;
                    curr_pswd = account.pswd;
                    curr_priv = result.priveledge;
                    console.log("User validated");
                } else {
                    console.log("Mismatch between local and remote user");
                }
            })

    } catch (e) {
        console.error(e);
    }
}

export const clearStorage = async () => {
    storage.clear();
}