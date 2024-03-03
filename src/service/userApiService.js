import db from "../models/index";
import {
  hashUserPassword,
  checkEmailExist,
  checkPhoneExist,
} from "./loginRegisterService";

const getAllUsers = async () => {
  try {
    let users = await db.User.findAll({
      attributes: ["id", "username", "email", "phone", "sex"],
      include: { model: db.Group, attributes: ["name", "description"] },
    });
    if (users) {
      return {
        EM: "get data success",
        EC: 0,
        DT: users,
      };
    } else {
      return {
        EM: "get data success",
        EC: 0,
        DT: [],
      };
    }
  } catch (error) {
    console.log(error);
    return {
      EM: "somthing wrong with service",
      EC: 1,
      DT: [],
    };
  }
};

const getUserWithPagination = async (page, limit) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.User.findAndCountAll({
      offset: offset,
      limit: limit,
      attributes: ["id", "username", "email", "phone", "sex", "address"],
      include: { model: db.Group, attributes: ["name", "description", "id"] },
      order: [["id", "DESC"]],
    });

    let totalPages = Math.ceil(count / limit);
    let data = {
      totalRows: count,
      totalPages: totalPages,
      users: rows,
    };

    return {
      EM: "FETCH Ok!",
      EC: 0,
      DT: data,
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "somthing wrong with service",
      EC: 1,
      DT: [],
    };
  }
};

const createNewUser = async (data) => {
  try {
    // check email/phone number
    let isEmailExist = await checkEmailExist(data.email);
    if (isEmailExist === true) {
      return {
        EM: "The email is a already exist",
        EC: 1,
        DT: "email",
      };
    }
    let isPhoneExist = await checkPhoneExist(data.phone);
    if (isPhoneExist === true) {
      return {
        EM: "The phone number is a already exist",
        EC: 1,
        DT: "phone",
      };
    }
    // hash user password
    let hashPassword = hashUserPassword(data.password);

    // create new user
    await db.User.create({ ...data, password: hashPassword });
    return {
      EM: "CREATE Ok!",
      EC: 0,
      DT: [],
    };
  } catch (error) {
    console.log(error);
  }
};

const updateUsers = async (data) => {
  try {
    let user = await db.User.findOne({
      where: { id: data.id },
    });

    if (user) {
      // update
    } else {
      // not found user
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async (id) => {
  try {
    let user = await db.User.findOne({
      where: { id: id },
    });
    if (user) {
      await user.destroy();

      return {
        EM: "DELETE user success",
        EC: 0,
        DT: [],
      };
    } else {
      return {
        EM: "user not exist",
        EC: 2,
        DT: [],
      };
    }
  } catch (error) {
    console.log(error);
    return {
      EM: "error from service",
      EC: 1,
      DT: [],
    };
  }
};

module.exports = {
  getAllUsers,
  createNewUser,
  updateUsers,
  deleteUser,
  getUserWithPagination,
};
