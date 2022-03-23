const User = require('../model/user');
const userController = {
  //GET ALL USERS
  getAllUser: async(req, res) => {
    const user = await User.find();
    return res.status(200).json(user);
  },

  //DELETE USERS
  deleteUser: async(req, res) => {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json('delete successfully');
  }
}

module.exports = userController;