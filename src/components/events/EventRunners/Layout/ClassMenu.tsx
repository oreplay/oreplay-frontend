import Button from "@mui/material/Button";
import {Box, ButtonGroup, Dialog, DialogContent, DialogTitle, Typography} from "@mui/material";

import {useEffect, useState} from "react";
import {getClassesInStage} from "../../../../services/EventService.ts";
import {ClassModel} from "../../../../shared/EntityTypes.ts";
import {useTranslation} from "react-i18next";

/**
 * Get a state with a list of classes.
 * @param eventId Backend database id of the event the data is to be grabbed from
 * @param stageId Backend database id of the stage the data is to be grabbed from.
 * @returns [ClassesList,isLoading]
 * @returns ClassesList : ClassModel[]|null
 * @returns isLoading : boolean
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
            return <Button
              onClick={()=>{props.setActiveClass(classEntity)}}
              key={classEntity.id}
              sx={{
                color: 'text.secondary',
                border: 0,
                justifyContent: 'left',
              }}
            >
              {classEntity.short_name}
            </Button>
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
    <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center', maxWidth:1/5}}>

      <Button
        sx={{m:'auto'}}
        onClick={handleClick}
        fullWidth
      >
        <Typography sx={{color:'text.secondary'}}>{props.activeClass ? props.activeClass.short_name : t('Results.shortClass')}</Typography>
      </Button>

      <Dialog
        open={isMenuOpen}
        onClick={handleClick}
        onClose={handleClick}
        scroll={'paper'}
        maxWidth={'xs'}
        fullWidth={true}
      >
        <DialogTitle id='classes-dialog'>{t('Results.Classes')}</DialogTitle>
        <DialogContent>
          <ButtonGroup
            orientation={'vertical'}
            fullWidth
          >
            <ClassItems
              classesList={classesList}
              loading={areClassesLoading}
              setActiveClass={props.setActiveClass}
            />
          </ButtonGroup>
        </DialogContent>
      </Dialog>
    </Box>
  )
}