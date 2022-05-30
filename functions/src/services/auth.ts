import axios from "axios";
import { refreshToken } from "firebase-admin/app";

import { User } from "../commons";
import { UsersCollection } from "../database/db";

const login = async (email: string, password: string) => {
  try {
    const res = await axios.post(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA4XcRGBApDUKVrlLAkb75PzdJ_skDuPFA",
      {
        email,
        password,
        returnSecureToken: true,
      }
    );

    const tokenData = res.data();

    if (!tokenData.registered) {
      throw { status: 404, message: "User not found. Sign up now?" };
    }
    const data = {
      tokenId: tokenData.idToken,
      refreshToken: tokenData.refreshToken,
      expiresIn: tokenData.expiresIn,
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
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA4XcRGBApDUKVrlLAkb75PzdJ_skDuPFA",
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
      "https://identitytoolkit.googleapis.com/v1/accounts:delete?key=AIzaSyA4XcRGBApDUKVrlLAkb75PzdJ_skDuPFA",
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
