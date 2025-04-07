import { createContext} from "react";

const context = createContext({userInfo: null,
    setUserInfo: () => {}});

export default context;