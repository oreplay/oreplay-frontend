import {createContext} from "react";
import {ClassModel} from "../../../../shared/EntityTypes.ts";

export const SelectedClassContext = createContext<ClassModel|null>(null)