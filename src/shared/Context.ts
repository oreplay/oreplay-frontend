import {ClassModel} from "./EntityTypes.ts";
import {createContext} from "react";

export const activeClassContext =  createContext<ClassModel|null>(null);