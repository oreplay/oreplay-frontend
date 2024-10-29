import {useEffect, useState} from "react";
import {getClassesInStage} from "../services/EventService.ts";
import {ClassModel} from "../../../shared/EntityTypes.ts";
import {useSearchParams} from "react-router-dom";

export function useFetchClasses(eventId:string, stageId:string):[ClassModel|null,(class_id:string)=>void,ClassModel[],boolean] {
  const ACTIVE_CLASS_SEARCH_PARAM = "class_id"
  const [searchParams,setSearchParams] = useSearchParams();

  // Associated states
  const [isLoading,setIsLoading] = useState<boolean>(true);
  const [classesList,setClassesList] = useState<ClassModel[]>([]);
  const [activeClass,setActiveClassState] = useState<ClassModel|null>(null);

  // HTTP request
  useEffect(
    () => {

      const fetchClasses = async () => {
        try {
          const response = await getClassesInStage(eventId, stageId)
          // set Classes list
          setClassesList(response.data)

          // set active class from URL if given
          const new_active_class_id = searchParams.get(ACTIVE_CLASS_SEARCH_PARAM);
          if (new_active_class_id) {
            const new_active_class = response.data?.find(e=> e.id === new_active_class_id);
            if (new_active_class) {
              setActiveClassState(new_active_class);
            } else {
              console.log(`Provided class id ${new_active_class_id} doesn't exist. The classes list is ${classesList}`)
            }
          }
        } catch (error) {
          console.error("error in get classes: ", error);
        } finally {
          setIsLoading(false)
        }

      }

      fetchClasses()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ,[])

  // Set selected class function. It handles the search param usage
  const setActiveClassId = (newActiveClassId:string) => {
    const new_active_class = classesList.find((e) => e.id === newActiveClassId);
    if (new_active_class) {
      setActiveClassState(new_active_class)
      searchParams.set(ACTIVE_CLASS_SEARCH_PARAM,newActiveClassId)
      setSearchParams( searchParams )
    } else {
      console.error("The selected class is not valid")
    }
  }

  return [activeClass,setActiveClassId,classesList,isLoading]
}