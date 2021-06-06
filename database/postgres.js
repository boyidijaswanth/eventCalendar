const { Pool } = require('pg');
const util = require('util');
const config = require('./../settings.json')
class Udayydb {
    constructor() {
        this.config = config.database
    }
    exception_message(exception) {
        console.log(exception)
    }
    error_db_connection(err) {
        console.log('db error', err);
        if (err.fatal && err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log("closed the connection started ", started_at_timestamp)
            this.get_db_client()
        }
    }
    get_db_client() {
        try {
            this.db_client = new Pool({
                user: this.config.username,
                host: this.config.host,
                database: this.config.db,
                password: this.config.password,
                port: this.config.port,
            })
            this.db_client.on('error', this.error_db_connection.bind(this))
            this.query = util.promisify(this.db_client.query).bind(this.db_client);
            if (this.query instanceof Error) return console.error(this.query)
            return this.db_client
        } catch (err) {
            console.log("Exception in get_db_client method")
            this.exception_message(err)
            return null
        }
    }
    close_db_client() {
        if (this.db_client) {
            this.db_client.end((err) => {
                if (err) {
                    return console.log('error:' + err.message);
                }
                console.log('Closed the database connection.');
            });
        }
        this.db_client = null
    }
}
module.exports = Udayydb;