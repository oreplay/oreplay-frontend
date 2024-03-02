import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import KayakingIcon from '@mui/icons-material/Kayaking';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import ExploreIcon from '@mui/icons-material/Explore';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function EventsList() {

    const navigate = useNavigate();
    const { t } = useTranslation();

    const headers: {id: string, label: string}[] = [
        {
            id: "dates",
            label: t("Dates")
        }, 
        {
            id: "event",
            label: t("Event")
        },
        {
            id: "location",
            label: t("Location")
        },
        {
            id: "organizer",
            label: t("Organizer")
        },
        {
            id: "tipo",
            label: ""
        }
    ];

    const list: {id:number, fechaInicio: string, fechaFin: string | null, 
        liga: string, nombre: string, ubicacion: string, organizador: string, tipo: number}[] = [
        {
            id: 1,
            fechaInicio: "04/02/2024",
            fechaFin: "05/02/2024",
            liga: "Liga Española de OPIE",
            nombre: "XII Premi de la Comunitat Valenciana",
            ubicacion: "Valencia",
            organizador: "FEDO CV",
            tipo: 1
        },
        {
            id: 2,
            fechaInicio: "11/02/2024",
            fechaFin: null,
            liga: "Liga Española de Rogaining",
            nombre: "II Rogaine de Alcarrache",
            ubicacion: "Badajoz",
            organizador: "FEXO",
            tipo: 4
        },
        {
            id: 3,
            fechaInicio: "25/02/2024",
            fechaFin: "26/02/2024",
            liga: "Liga Española de OPIE",
            nombre: "XXXV Costa Cálida",
            ubicacion: "Murcia",
            organizador: "FORM",
            tipo: 1
        }
    ]

    function getIconByType(type: number)
    {
        switch (type) {
            case 1:
                return (
                    <Tooltip title="OPIE">
                        <DirectionsRunIcon color="primary"/>
                    </Tooltip>
                )
            case 2:
                return (
                    <Tooltip title="RAID">
                        <KayakingIcon color="primary"/>
                    </Tooltip>
                )
            case 3:
                return (
                    <Tooltip title="MTBO">
                        <DirectionsBikeIcon color="primary"/>
                    </Tooltip>
                )
            case 4:
                return (
                    <Tooltip title="ROGAINE">
                        <ExploreIcon color="primary"/>
                    </Tooltip>
                )
        }
    }

    return (
        <Box sx={{m: "50px"}}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {headers.map((header) => (
                                <TableCell sx={{fontWeight: "bold"}} key={header.id}>
                                    {header.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.map((e, index) => (
                            <TableRow onClick={() => navigate(`/detail/${e.id}`)} hover>
                                <TableCell>{e.fechaFin ? `${e.fechaInicio} - ${e.fechaFin}` : e.fechaInicio}</TableCell>
                                <TableCell>{e.nombre}</TableCell>
                                <TableCell>{e.liga}</TableCell>
                                <TableCell>{e.ubicacion}</TableCell>
                                <TableCell>{e.organizador}</TableCell>
                                <TableCell>
                                    {getIconByType(e.tipo)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}