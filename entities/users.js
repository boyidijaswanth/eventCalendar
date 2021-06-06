const UserDetails = require('./../models/users.js');
const config = require('./../settings.json').rest;
class Users {
    async createNewUser(request, response) {
        let responseMessage = config.failureMessage;
        request.body.active = false;
        let newUser = await UserDetails.createNewUser(request.body).catch((error) => {
            return error
        });
        if (newUser instanceof Error) {
            responseMessage.message = newUser.message
            response.status(config.baddataStatus).send(responseMessage)
            return;
        }
        responseMessage = config.successfullMessage;
        responseMessage.message = "a new user is created";
        responseMessage.user_id = newUser.rows[0].id
        response.send(responseMessage);
    }
}
module.exports = new Users();