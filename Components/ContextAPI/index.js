import { createContext } from "react";

//1st step

export const BioContext = createContext();

//2nd step

export const BioProvider = () => {
  const myName = "vinod";

  return <BioContext.Provider value={myName}></BioContext.Provider>;
};
