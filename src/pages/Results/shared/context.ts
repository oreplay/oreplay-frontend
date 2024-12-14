import {createContext} from "react";
import {ClassModel} from "../../../shared/EntityTypes.ts";
import {ProcessedRunnerModel} from "../components/VirtualTicket/shared/EntityTypes.ts";

export const SelectedClassContext = createContext<ClassModel|null>(null)
export const RunnersContext = createContext<[ProcessedRunnerModel[],boolean]>([[],false])