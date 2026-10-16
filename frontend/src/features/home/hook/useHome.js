import { useContext } from "react";
import { HomeContext } from "../home.context";

export const useHome = () => {
  const context = useContext(HomeContext);
  if (!context) throw new Error("useHome must be used inside HomeProvider");
  return context;
};
