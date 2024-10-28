/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
"use client";
import { UserDTO } from "@/dtos/UserDTO";
import { api } from "@/services/api";
import {
  storageAuthTokenGet,
  storageAuthTokenRemove,
  storageAuthTokenSave,
} from "@/storage/storageAuthToken";
import {
  storageUserGet,
  storageUserRemove,
  storageUserSave,
} from "@/storage/storageUser";
import { setCookie } from "nookies";
import { ReactNode, createContext, useEffect, useState } from "react";

export type AuthContextDataProps = {
  signIn: ({ email, password }: SignInCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  isLoadingContext: boolean;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthorizationResponse {
  access_token: string;
}

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

export function AuthProvider({ children }: AuthContextProviderProps) {
  const [isLoadingContext, setIsLoadingContext] = useState(true);
  const [, setUser] = useState<UserDTO>({} as UserDTO);

  async function userAndTokenUpdate(userData: UserDTO, token: string) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
  }

  async function storageUserAndTokenSave(
    userData: UserDTO,
    token: string
  ) {
    try {
      setIsLoadingContext(true);
      await storageUserSave(userData);
      await storageAuthTokenSave(token);
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingContext(false);
    }
  }

  async function signIn({ email, password }: SignInCredentials) {
    try {
      setIsLoadingContext(true);

      const response = await api.post<AuthorizationResponse>("/login", {
        email: email,
        password: password,
      });
      const { access_token } = response.data;
      setCookie(undefined, "@desafio:token", access_token, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
      api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      const responseUser = await api.get("user");

      const user: UserDTO = {
        id: responseUser.data.data.id,
        name: responseUser.data.data.name,
        email: responseUser.data.data.email,
        is_admin: responseUser.data.data.is_admin,
        created_at: responseUser.data.data.created_at,
        updated_at: responseUser.data.data.cupdated_atity
      };

      if (access_token && user) {
        await storageUserAndTokenSave(user, access_token);
        await userAndTokenUpdate(user, access_token);
      }
      setIsLoadingContext(true);
      document.location.href = "/";
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingContext(false);
    }
  }

  async function signOut() {
    try {
      setIsLoadingContext(true);
      await storageUserRemove();
      await storageAuthTokenRemove();

      document.location.href = "/";
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingContext(false);
    }
  }

  async function loadMainUserData() {
    try {
      setIsLoadingContext(true);
      const access_token = await storageAuthTokenGet();
      const loggedMainUser = await storageUserGet();

      if (access_token && loggedMainUser) {
        await userAndTokenUpdate(loggedMainUser, access_token);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingContext(false);
    }
  }

  useEffect(() => {
    loadMainUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        isLoadingContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
