const Udayydb = require('./../database/postgres.js');
const util = require('util');
class Users extends Udayydb {
    async createNewUser(data) {
        let query_string = null
        this.db_client = this.db_client || this.get_db_client()
        if (this.db_client) {
            if (!this.query) {
                this.query = util.promisify(this.db_client.query).bind(this.db_client);
                if (this.query instanceof Error) return console.error(this.query)
            }
            query_string = "insert into users (name,email,password) values('"+data.name+"','"+data.email+"','"+data.password+"') returning id";
            try {
                let rows = await this.query(query_string);
                if (rows instanceof Error) {
                    console.log(rows);
                    if (rows.fatal && rows.code === 'PROTOCOL_CONNECTION_LOST') {
                        this.db_client = this.get_db_client()
                    }
                    return rows
                }
                return rows
            } catch (err) {
                console.log("Exception in createNewUser method ")
                this.exception_message(err)
            }
            return false;
        }
        return false;
    }
}
module.exports = new Users();