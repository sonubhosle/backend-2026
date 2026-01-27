const UserService = require('../services/UserService')

const getAllUser = async (req, res) => {
    try {

        const users = await UserService.getAllUsers();

        return res.status(200).send(users)

    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

module.exports = {getAllUser}