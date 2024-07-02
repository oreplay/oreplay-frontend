import Button from "@mui/material/Button";
import {Box, Typography} from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {useEffect, useState} from "react";
import {getClassesInStage} from "../../services/EventService.ts";
import {ClassModel} from "../../shared/EntityTypes.ts";
import {useTranslation} from "react-i18next";

/**
 * Custom hook to query and load classes
 * @param eventId Backend database id of the event the data is to be grabbed from
 * @param stageId Backend database id of the stage the data is to be grabbed from.
 */
function useClass (eventId:string,stageId:string):[ClassModel[]|null,boolean]  {
  const [isLoading,setIsLoading] = useState(true);
  const [classesList,setClassesList] = useState<ClassModel[]|null>(null)

  useEffect(() => {
    setClassesList(null);
    getClassesInStage(eventId,stageId).then((response)=>{
      setClassesList(response.data)
    }).then(()=>{
      setIsLoading(false)
    })

    return () => setIsLoading(true)
  }, [eventId,stageId]);

  return [classesList,isLoading]
}

interface ClassMenuProps {
  setActiveClass: (activeClass: ClassModel) => void,
  activeClass : ClassModel|null,
  eventId : string,
  stageId : string
}

interface ClassItemsProps {
  classesList:ClassModel[]|null,
  loading:boolean,
  setActiveClass: (activeClass:ClassModel) => void
}

function ClassItems(props:ClassItemsProps) {
  if (props.loading) {
    return <Typography>Loading</Typography>
  } else if (props.classesList === null) {
    return <Typography> No classes yet </Typography>
  }
  else {
    return (
      <>
        {
          props.classesList.map( (classEntity)=>{
            return <MenuItem
              onClick={()=>{props.setActiveClass(classEntity)}}
              key={classEntity.id}
            >{classEntity.short_name}</MenuItem>
          })
        }
      </>
    )
  }
}

export default function ClassMenu(props:ClassMenuProps) {

  const [isMenuOpen, setMenuOpen] = useState(false);
  const [classesList,areClassesLoading] = useClass(props.eventId,props.stageId)
  const {t} = useTranslation()

  const handleClick = () => {
    setMenuOpen(!isMenuOpen)
  };

  return(
    <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center'}}>
      <Button sx={{m:'auto'}}
        onClick={handleClick}
      >
        <Typography sx={{color:'text.secondary'}}>{props.activeClass ? props.activeClass.short_name : t('Results.shortClass')}</Typography>
      </Button>

      <Menu
        open={isMenuOpen}
        onClick={handleClick}
        onClose={handleClick}
        anchorReference={'none'}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
        sx={{
          minWidth: '20px',
          maxWidth: '80%',
          marginX: 'auto',
          marginY: 'auto',
          paddingX: 'auto'
        }}
      >
        <ClassItems
          classesList={classesList}
          loading={areClassesLoading}
          setActiveClass={props.setActiveClass}
        />
      </Menu>
    </Box>
  )
}