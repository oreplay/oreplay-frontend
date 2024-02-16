import { Box } from "@mui/material";
import { useParams } from "react-router-dom";

export default function EventDetail() {

    const params = useParams();

    const idEvent = params.event; // Con este id llamariamos a back para recuperar la info de este evento

    // Data son datos de mentira mockeados
    const data:{id: number, evento: string, fechaInicio: string, fechaFin:string, tipo: number, organizador: string, ubicacion: string,
    pruebas: {}[]} = {
        id: 1,
        evento: "XII Premi de la Comunitat Valenciana",
        fechaInicio: "04/02/2024",
        fechaFin: "05/02/2024",
        tipo: 1,
        organizador: "FEDO CV",
        ubicacion: "Valencia",
        pruebas: [
            {
                id: 1,
                prueba: "Distancia larga"
            },
            {
                id: 2,
                prueba: "Distancia media"
            }
        ]
    }

    return (
        <Box>
            DETALLE
        </Box>
    )
}