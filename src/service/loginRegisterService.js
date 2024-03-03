import db from "../models/index";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";

const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (userPassword) => {
  return bcrypt.hashSync(userPassword, salt);
};

const checkEmailExist = async (userEmail) => {
  let user = await db.User.findOne({
    where: { email: userEmail },
  });

  if (user) {
    return true;
  }

  return false;
};

const checkPhoneExist = async (userPhone) => {
  let user = await db.User.findOne({
    where: { phone: userPhone },
  });

  if (user) {
    return true;
  }

  return false;
};

const registerNewUser = async (rawUserData) => {
  try {
    // check email/phonenumber are exist
    let isEmailExist = await checkEmailExist(rawUserData.email);
    if (isEmailExist === true) {
      return {
        EM: "The email is a already exist",
        EC: 1,
      };
    }
    let isPhoneExist = await checkPhoneExist(rawUserData.phone);
    if (isPhoneExist === true) {
      return {
        EM: "The phone number is a already exist",
        EC: 2,
      };
    }
    // hash user password
    let hashPassword = hashUserPassword(rawUserData.password);
    // create new user
    await db.User.create({
      email: rawUserData.email,
      username: rawUserData.username,
      password: hashPassword,
      phone: rawUserData.phone,
    });

    return {
      EM: "A user is a created successfully!",
      EC: 0,
    };
  } catch (error) {
    console.log(">> check error: ", error);
    return {
      EM: "Something wrongs in service....",
      EC: -2,
    };
  }
};

const checkPassword = (inputPassword, hashPassword) => {
  return bcrypt.compareSync(inputPassword, hashPassword); //true or false
};

const handleUserLogin = async (rawData) => {
  try {
    let user = await db.User.findOne({
      where: {
        [Op.or]: [{ email: rawData.valueLogin }, { phone: rawData.valueLogin }],
      },
    });

    if (user) {
      console.log(">>> Found user with email/phone");
      let isCorrectPassword = await checkPassword(
        rawData.password,
        user.password
      );

      if (isCorrectPassword === true) {
        return {
          EM: "ok!",
          EC: 0,
          DT: "",
        };
      }
    }

    console.log(
      ">>> input user with email/phone: ",
      rawData.valueLogin,
      "Password: ",
      rawData.password
    );

    return {
      EM: "Your email/phone or password is incorrect",
      EC: 1,
      DT: "",
    };
  } catch (error) {
    console.log(">> check error: ", error);
    return {
      EM: "Something wrongs in service....",
      EC: -2,
    };
  }
};

module.exports = {
  registerNewUser,
  handleUserLogin,
  hashUserPassword,
  checkEmailExist,
  checkPhoneExist,  
};
