import {ClassModel, RunnerModel} from "./EntityTypes.ts";
import {createContext} from "react";

export const activeClassContext =  createContext<ClassModel|null>(null);
export const runnerListContext = createContext<[RunnerModel[]|null,boolean]>([null,false]);
