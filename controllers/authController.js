const UserModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");

module.exports = {
  /** POST: http://localhost:3000/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/
  createUser: async (req, res) => {
    try {
      const { username, password, profile, email } = req.body;

      // Check if the username already exists
      const existUsername = await UserModel.findOne({ username });
      if (existUsername) {
        return res.status(400).send({ error: "Please use a unique username" });
      }

      // Check if the email already exists
      const existEmail = await UserModel.findOne({ email });
      if (existEmail) {
        return res.status(400).send({ error: "Please use a unique email" });
      }

      if (password) {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new UserModel({
          username,
          password: hashedPassword,
          profile: profile || "",
          email,
        });

        // Save the user to the database
        const result = await user.save();
        return res.status(201).send({
          status: "success",
          msg: "User registered successfully",
          user: result,
        });
      }
    } catch (error) {
      return res.status(500).send({ error: "Internal server error" });
    }
  },

  verifyUser: async (req, res, next) => {
    try {
      const { username } = req.method === "GET" ? req.query : req.body;

      // check the user existance
      let exist = await UserModel.findOne({ username });
      //   if (exist) return res.status(201).send({ status: "Success" });
      if (!exist)
        return res.status(404).send({ status: 404, error: "Can't find User!" });

      next();
    } catch (error) {
      return res.status(404).send({ error: "Authentication Error" });
    }
  },

  /** POST: http://localhost:3000/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
  login: async (req, res) => {
    const { username, password } = req.body;
    console.log("BODY LOGIN", req.body);

    try {
      const user = await UserModel.findOne({ username });
      console.log("USER", user);
      if (!user) {
        return res.status(404).send({ error: "Username not found" });
      }

      const passwordCheck = await bcrypt.compare(password, user.password);
      console.log("passwordCheck", passwordCheck);
      if (!passwordCheck) {
        return res.status(400).send({ error: "Password does not match" });
      }

      const token = jwt.sign(
        {
          userId: user._id,
          username: user.username,
        },
        process.env.SECRET_KEY,
        { expiresIn: "24h" }
      );
      console.log("token", token);

      return res.status(200).send({
        status: "success",
        username: user.username,
        token,
      });
    } catch (error) {
      return res.status(500).send({ error: "Internal server error" });
    }
  },

  /** GET: http://localhost:3000/api/user/example123 */
  getUser: async (req, res) => {
    const { username } = req.params;

    try {
      if (!username) {
        return res.status(400).send({ error: "Invalid username" });
      }

      const user = await UserModel.findOne({ username });

      console.log("GETUSER", user);

      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }

      // Remove password from user
      const { password, ...rest } = user.toJSON();

      return res.status(200).send(rest);
    } catch (error) {
      return res.status(500).send({ error: "Internal server error" });
    }
  },

  /** GET: http://localhost:3000/api/generateOTP */
  generateOTP: async (req, res) => {
    req.app.locals.OTP = await otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    res.status(201).send({ code: req.app.locals.OTP });
  },

  /** GET: http://localhost:3000/api/verifyOTP */
  verifyOTP: async (req, res) => {
    const { code } = req.query;
    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
      req.app.locals.OTP = null; // reset the OTP value
      req.app.locals.resetSession = true; // start session for reset password
      console.log("Successsfully");
      return res.status(201).send({ msg: "Verify Successsfully!" });
    } else {
       console.log("ERRORLY");
      return res.status(400).send({ error: "Invalid OTP" });
    }
  },

  // successfully redirect user when OTP is valid
  /** GET: http://localhost:8080/api/createResetSession */
  createResetSession: async (req, res) => {
    if (req.app.locals.resetSession) {
      req.app.locals.resetSession = false;
      return res.status(201).send({ flag: req.app.locals.resetSession });
    }
    return res.status(440).send({ error: "Session expired!" });
  },

  /** PUT: http://localhost:3000/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
  updateUser: async (req, res) => {
    try {
      // const id = req.query.id;
      const { userId } = req.user;
      if (!userId) {
        return res.status(400).send({ error: "Invalid user ID" });
      }

      const body = req.body;
      const data = await UserModel.updateOne({ _id: userId }, body);

      if (!data) {
        return res.status(404).send({ error: "User not found" });
      }

      return res.status(201).send({ msg: "Record Updated" });
    } catch (error) {
      return res.status(500).send({ error: "Internal server error" });
    }
  },

  // update the password when we have valid session
  /** PUT: http://localhost:3000/api/resetPassword */
  resetPassword: async (req, res) => {
    try {
      if (!req.app.locals.resetSession) {
        return res.status(440).send({ error: "Session expired!" });
      }

      const { username, password } = req.body;

      try {
        const user = await UserModel.findOne({ username });
        if (!user) {
          return res.status(404).send({ error: "Username not found" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await UserModel.updateOne(
          { username: user.username },
          { password: hashedPassword }
        );

        req.app.locals.resetSession = false; // Reset session

        return res.status(201).send({ msg: "Record Updated" });
      } catch (error) {
        return res.status(500).send({ error: "Unable to hash password" });
      }
    } catch (error) {
      return res.status(401).send({ error });
    }
  },
};
