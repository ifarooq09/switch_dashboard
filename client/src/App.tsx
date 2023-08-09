import { Refine } from "@refinedev/core";
import {
  ErrorComponent,
  ReadyPage,
  RefineSnackbarProvider,
  notificationProvider,
} from "@refinedev/mui";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { useState } from "react";

import {
  VillaOutlined,
  LanOutlined,
  StairsOutlined,
  PeopleOutlined,
  AccountCircleOutlined,
  SearchOutlined
} from "@mui/icons-material";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faServer } from '@fortawesome/free-solid-svg-icons'

import routerProvider from "@refinedev/react-router-v6/legacy";
import dataProvider from "@refinedev/simple-rest";
import axios, { AxiosRequestConfig } from "axios";
import { Header, Layout, Sider, Title } from "components/layout";
import { ColorModeContextProvider } from "contexts";

import {
  Login,
  Dashboard,
  AllBuildings,
  BuildingDetails,
  CreateBuilding,
  EditBuilding,
  AllFloors,
  FloorDetails,
  EditFloor,
  CreateFloor,
  AllSwitches,
  SwitchDetails,
  CreateSwitch,
  EditSwitch,
  AllPorts,
  PortDetails,
  EditPort,
  CreatePort,
  AllUsers,
  UserDetails,
  CreateUser,
  EditUser,
  MyProfile,
  Search
} from "./pages";

interface LoginCredentials {
  email?: string;
  password?: string;
}

type AuthProviderType =  {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkError: () => Promise<void>,
  checkAuth: () => Promise<void>,
  getPermissions: () => Promise<{}>,
  getUserIdentity: () => Promise<void>
}

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((request: AxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (request.headers) {
    request.headers["Authorization"] = `Bearer ${token}`;
  } else {
    request.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  return request;
});

function App() {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : {};
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      return {};
    }
  });
  const { role } = user;

  const authProvider: AuthProviderType = {
    login: async ({ email, password }: LoginCredentials) => {
      try {
        // Check the credentials in the MongoDB database
        const response = await fetch(
          "http://localhost:8080/api/v1/user/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              password,
            }),
          }
        );

        const data = await response.json();
        //console.log("Data" + JSON.stringify(data))

        if (response.status === 200) {
          localStorage.setItem("token", data.token);
          const userInfo = {
            _id: data._id,
            name: data.name,
            email: data.email,
            avatar: data.avatar,
            role: data.role,
          };
          localStorage.setItem("user", JSON.stringify(userInfo));
          setUser(userInfo); // Update the user state here
          //console.log("User information stored in localStorage:", userInfo);
          return Promise.resolve();
        } else {
          return Promise.reject(data.message);
        }
      } catch (error) {
        return Promise.reject(error);
      }
    },

    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      axios.defaults.headers.common = {};
      setUser({});
      return Promise.resolve();
    },
    checkError: () => Promise.resolve(),
    checkAuth: async () => {
      const token = localStorage.getItem("token");

      if (token) {
        return Promise.resolve();
      }
      return Promise.reject();
    },

    getPermissions: async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const { role } = user;

      if (role === "admin") {
        const permissions = {
          buildings: "all",
          floors: "all",
          switches: "all",
          ports: "all",
          users: "all",
        };
        return Promise.resolve(permissions);
      } else if (role === "editor") {
        const permissions = {
          buildings: ["list", "show", "edit"],
          floors: ["list", "show", "edit"],
          switches: ["list", "show", "edit"],
          ports: ["list", "show", "edit"],
        };
        return Promise.resolve(permissions);
      } else {
        return Promise.resolve({});
      }
    },
    getUserIdentity: async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const user = localStorage.getItem("user");
        if (user) {
          return Promise.resolve(JSON.parse(user));
        }
      }
      return Promise.resolve({ name: "", email: "" });
    },
  };

  return (
    <ColorModeContextProvider>
      <CssBaseline />
      <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
      <RefineSnackbarProvider>
        <Refine
          dataProvider={dataProvider("http://localhost:8080/api/v1")}
          notificationProvider={notificationProvider}
          ReadyPage={ReadyPage}
          catchAll={<ErrorComponent />}
          resources={
            role === "admin"
              ? [
                  {
                    name: "building",
                    list: AllBuildings,
                    show: BuildingDetails,
                    create: CreateBuilding,
                    edit: EditBuilding,
                    icon: <VillaOutlined />,
                  },
                  {
                    name: "floor",
                    list: AllFloors,
                    show: FloorDetails,
                    create: CreateFloor,
                    edit: EditFloor,
                    icon: <StairsOutlined />,
                  },
                  {
                    name: "switch",
                    list: AllSwitches,
                    show: SwitchDetails,
                    create: CreateSwitch,
                    edit: EditSwitch,
                    icon: <FontAwesomeIcon icon={faServer} />,
                  },
                  {
                    name: "port",
                    list: AllPorts,
                    show: PortDetails,
                    create: CreatePort,
                    edit: EditPort,
                    icon: <LanOutlined />,
                  },
                  {
                    name: "user",
                    list: AllUsers,
                    show: UserDetails,
                    create: CreateUser,
                    edit: EditUser,
                    icon: <PeopleOutlined />,
                  },
                  {
                    name: "my-profile",
                    options: { label: "My Profile"},
                    list: MyProfile,
                    icon: <AccountCircleOutlined />,
                  },
                  {
                    name: "search",
                    list: Search,
                    options: { label: "Search"},
                    icon: <SearchOutlined />
                  }
                ]
              : [
                  {
                    name: "building",
                    list: AllBuildings,
                    show: BuildingDetails,
                    create: CreateBuilding,
                    edit: EditBuilding,
                    icon: <VillaOutlined />,
                  },
                  {
                    name: "floor",
                    list: AllFloors,
                    show: FloorDetails,
                    create: CreateFloor,
                    edit: EditFloor,
                    icon: <StairsOutlined />,
                  },
                  {
                    name: "switch",
                    list: AllSwitches,
                    show: SwitchDetails,
                    create: CreateSwitch,
                    edit: EditSwitch,
                    icon: <FontAwesomeIcon icon={faServer} />,
                  },
                  {
                    name: "port",
                    list: AllPorts,
                    show: PortDetails,
                    create: CreatePort,
                    edit: EditPort,
                    icon: <LanOutlined />,
                  },
                  {
                    name: "my-profile",
                    options: { label: "My Profile" },
                    list: MyProfile,
                    edit: EditUser,
                    icon: <AccountCircleOutlined />,
                  },
                  {
                    name: "search",
                    list: Search,
                    options: { label: "Search"},
                    icon: <SearchOutlined />
                  }
                ]
          }
          Title={Title}
          Sider={Sider}
          Layout={Layout}
          Header={Header}
          legacyRouterProvider={routerProvider}
          legacyAuthProvider={authProvider}
          LoginPage={Login}
          DashboardPage={Dashboard}
        />
      </RefineSnackbarProvider>
    </ColorModeContextProvider>
  );
}

export default App;
