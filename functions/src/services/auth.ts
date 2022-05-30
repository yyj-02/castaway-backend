import axios from "axios";
import "dotenv/config";

import { User } from "../commons";
import { UsersCollection } from "../database/db";

const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const res = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.IDENTITY_SERVER_API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );

    if (!res.data.registered) {
      throw { status: 404, message: "User not found. Sign up now?" };
    }
    const data = {
      idToken: res.data.idToken,
      userId: res.data.localId,
      refreshToken: res.data.refreshToken,
      expiresIn: res.data.expiresIn,
    };

    return data;
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

const signup = async ({
  email,
  password,
  displayName,
}: {
  email: string;
  password: string;
  displayName: string;
}) => {
  try {
    const res = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.IDENTITY_SERVER_API_KEY}`,
      {
        email: email,
        password: password,
        returnSecureToken: true,
      }
    );

    const newUser: User = {
      email,
      displayName,
      creations: [],
      favorites: [],
    };

    await UsersCollection.doc(res.data.localId).set(newUser);

    const data = {
      idToken: res.data.idToken,
      userId: res.data.localId,
      refreshToken: res.data.refreshToken,
      expiresIn: res.data.expiresIn,
    };

    return data;
  } catch (err: any) {
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

const deleteAccount = async (userId: string) => {
  try {
    await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${process.env.IDENTITY_SERVER_API_KEY}`,
      { idToken: userId }
    );

    return {
      status: "OK",
      message: "Your account is deleted. Thank you for using Castaway.",
    };
  } catch (err: any) {
    console.log(err);
    throw { status: err?.status || 500, message: err?.message || err };
  }
};

export default {
  login,
  signup,
  deleteAccount,
};
