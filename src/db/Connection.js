import SQLite from "react-native-sqlite-storage";
import AsyncStorage from '@react-native-community/async-storage';
import props from "../config/properties";

SQLite.enablePromise(true);
const Connection = {

    db: null,

    /**
     * Initializes a new db connection.
     * On production its good to use connection pool.
     * Returns a promise that resolves to the db connection.
     */
    get : () => {
        return new Promise((resolve,reject) => {
            /** Return existing connection if exist, else go for the new one. */
            if(this.db)
                resolve(this.db);
            else{
                SQLite.openDatabase({
                    name: props.db.name,
                    location: "default"
                }).then(db => {
                    this.db =db;
                    /* Check whether database tables exist or not*/
                    AsyncStorage.getItem('dbexist').then((value) => {
                        if(!value){
                            //Create tables
                            db.transaction(tx => {
                                tx.executeSql(
                                    "CREATE TABLE IF NOT EXISTS tasks( " +
                                    "id INTEGER PRIMARY KEY NOT NULL, " +
                                    "description TEXT, " +
                                    "title TEXT, " +
                                    "status INTEGER DEFAULT 0 " +
                                    ");"
                                );
                            }).then(()=>{
                                AsyncStorage.setItem("dbexist",true);
                                if(props.logging)
                                    console.log("Tables created successfully");
                                resolve(db);
                            }).catch(error=>{
                                reject(error);
                            });
                        }else{
                            if(props.logging)
                                console.log("Database opened successfully");
                            resolve(db);
                        }
                    });
                }).catch(error => {
                    reject(error);
                });
            }
        });
    },

    /**
     * Returns a promise that resolves to the result of the sql query
     */
    fetchAllTask : (db) => {
        // Get all the lists, ordered by newest lists first
        if(props.logging)
            console.log("Fetching lists of all task from DB...");
        return db.executeSql("SELECT  id, title, description, status FROM tasks ORDER BY id DESC;");
    },

    /**
     * Saves a new task in the db, returns a promise
     */
    createNewTask : (db,taskObj) => {
        if(props.logging)
            console.log("Saving a new task in the DB...");
        return db.executeSql("INSERT INTO tasks (title, description, status) VALUES (?, ?, ?);", [
            taskObj.title,
            taskObj.description,
            taskObj.status
        ]);
    }
}

export default Connection;