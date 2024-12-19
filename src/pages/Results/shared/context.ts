import {createContext} from "react";
import {ClassModel} from "../../../shared/EntityTypes.ts";
import {ProcessedRunnerModel} from "../components/VirtualTicket/shared/EntityTypes.ts";
import {DateTime} from "luxon";

export const SelectedClassContext = createContext<ClassModel|null>(null)
export const RunnersContext = createContext<[ProcessedRunnerModel[],boolean]>([[],false])
export const NowContext = createContext<DateTime>(DateTime.now())