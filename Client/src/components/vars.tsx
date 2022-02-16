import { listConnections } from "./StorageService";

export interface connectionInterface {
    name: string,
    ip: string,
    user: string,
    pswd: string,
    ddb: string
}
let connections: connectionInterface[] = [];
let curr_connection: connectionInterface = {name: '', ip: '', user: '', pswd: '', ddb: ''};

const loadConnections = async () => {
    connections = await listConnections();
    console.log(connections);
}

export interface databaseInterface { name: string }
let databases: databaseInterface[] = [];
let curr_database: databaseInterface = {name: ''};

export interface tableInterface { name: string }
let tables: tableInterface[] = [];
let curr_table: tableInterface = {name: ''};

const setCurrConnection = (connection: connectionInterface) => {
    curr_connection = connection;
    curr_database = { name: connection.ddb }
}

const setCurrDatabase = (database: databaseInterface) => (curr_database = database)

const setCurrTable = (table: tableInterface) => (curr_table = table)

const getCurrConnection = () => (curr_connection)

const getCurrDatabase = () => (curr_database)

const getCurrTable = () => (curr_table)

const pushConnection = (connection: connectionInterface) => (connections.push(connection))

const pushDatabase = (database: databaseInterface) => (databases.push(database))

const pushTable = (table: tableInterface) => (tables.push(table))

const getConnections = () => (connections);

const getDatabases = () => (databases);

const getTables = () => (tables);

const clearVars = () => {
    connections = [];
    databases = [];
    tables = [];
    curr_connection = {name: '', ip: '', user: '', pswd: '', ddb: ''};
    curr_database = {name: ''};
    curr_table = {name: ''};
}

export {
    setCurrConnection, setCurrDatabase, setCurrTable, getCurrConnection, getCurrDatabase, getCurrTable, 
    pushConnection, pushDatabase, pushTable, getConnections, getDatabases, getTables, clearVars, loadConnections
}