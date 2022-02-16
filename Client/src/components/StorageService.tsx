import { Storage, StoragePlugin } from '@capacitor/storage';
import { clearVars, connectionInterface, pushConnection } from './vars'

const storage: StoragePlugin = Storage;

const storeConnection = async (name: string, ip: string, user: string, pswd: string, ddb: string) => {
    const { value } = await storage.get({ key: 'connections' });
    let conns: connectionInterface[] = JSON.parse(value as string) === null ? [] : JSON.parse(value as string);

    let match = false;
    for (const i in conns) {
        if (Object.prototype.hasOwnProperty.call(conns, i)) {
            const element = conns[i];
            if (name === element.name) {
                match = true;
            }
        }
    }

    if (match === false) {
        const conn: connectionInterface = {
            name: name,
            ip: ip,
            user: user,
            pswd: pswd,
            ddb: ddb
        }
        await storage.set({
            key: conn.name,
            value: JSON.stringify(conn)
        });

        conns.push(conn);
        await storage.set({
            key: 'connections',
            value: JSON.stringify(conns)
        })
        console.log(conn);
        console.log(conns);
        pushConnection(conn);
    }
}

const listConnections = async () => {
    const { value } = await storage.get({ key: 'connections' });
    let conns: connectionInterface[] = JSON.parse(value as string) === null ? [] : JSON.parse(value as string);
    return conns;
}

const clearStorage = async () => {
    storage.clear();
    clearVars();
}

export { storeConnection, listConnections, clearStorage };