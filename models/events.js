const Udayydb = require('./../database/postgres.js');
const util = require('util');
class Events extends Udayydb {
    async createNewEvent(data) {
        let query_string = null
        this.db_client = this.db_client || this.get_db_client()
        if (this.db_client) {
            if (!this.query) {
                this.query = util.promisify(this.db_client.query).bind(this.db_client);
                if (this.query instanceof Error) return console.error(this.query)
            }
            query_string = "insert into events (event_name,is_recursive,recursive_days,description,recursion_event_end) values('"+data.event_name+"',"+data.is_recursive+","+data.recursive_days+",'"+data.description+"','"+data.recursion_event_end+"')  RETURNING id";
            console.log(query_string)
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
                console.log("Exception in createNewEvent method ")
                this.exception_message(err)
            }
            return false;
        }
        return false;
    }
}
module.exports = new Events();