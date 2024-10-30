import {createContext} from "react";
import {ClassModel, RunnerModel} from "../../../shared/EntityTypes.ts";

export const SelectedClassContext = createContext<ClassModel|null>(null)
export const RunnersContext = createContext<[RunnerModel[],boolean]>([[],false])