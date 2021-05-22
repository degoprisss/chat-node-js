const jwt = require("jsonwebtoken");
const { User } = require("../models");

const authController = {};

authController.signIn = async (req, res, next) => {
  
  const { email, password } = req.body;

  if (email === "" || password === "") {
    return res.status(403).json({ message: "empty fields" });
  }

  try{
    let user = await User.findOne({where: { email }});

    if (!user) {
      return res
        .status(403)
        .json({ message: "Wrong credentials" });
    } else if (!user.verifyPassword(password)) {
      return res
        .status(403)
        .json({ message: "Wrong credentials" });
    } else {
      const userData = {
        id: user.id,
        username: user.username,
        screenname: user.screenname,
        email: user.email,
        avatar: user.avatar,
      };
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: "8h" });

      return res.status(200).json({ user: userData, token });
    }
  }catch(error){
    next(error);
  }
};

authController.signUp = async (req, res, next) => {
  const { firstname, lastname, screenname, email, password } = req.body;

  try{
    const [user, created] = await User.findOrCreate({
      where: {
        email: email
      },
      defaults: {
        firstname, lastname, screenname, screenname, email, password
      }
    });

    if(!created){
      return res.status(409).json({
        message: "User exists!"
      });
    }
    return res.status(201).json(user);

  }catch(error){
    next(error);
  }
};

authController.getAuthenticatedUser = async (req, res, next) => {
  const email = req.user.email;

  try{
    let user = await User.findOne({
      where: { email },
      attributes: ["id", "screenname", "email", "avatar"],
    });
    res.json({ user });
  }catch(error){
    next(error);
  }
};

module.exports = authController;
