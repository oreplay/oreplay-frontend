import React from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
} from "@mui/material"
import { ShowChart, BarChart, ScatterPlot, Timeline, GridOn } from "@mui/icons-material"

export type GraphType = "line" | "bar" | "boxplot" | "position" | "heatmap"

interface GraphSelectionModalProps {
  open: boolean
  onClose: () => void
  onSelectGraph: (type: GraphType) => void
  selectedGraph: GraphType | null
}

const GraphSelectionModal: React.FC<GraphSelectionModalProps> = ({
                                                                   open,
                                                                   onClose,
                                                                   onSelectGraph,
                                                                   selectedGraph,
                                                                 }) => {
  const graphOptions = [
    {
      type: "line" as GraphType,
      label: "Gráfico de Líneas",
      description: "Tiempo acumulado de diferencia con el líder por control",
      icon: <ShowChart />,
      maxRunners: null,
    },
    {
      type: "bar" as GraphType,
      label: "Gráfico de Barras",
      description: "Tiempo total de carrera con tiempo de error (máx. 2 corredores)",
      icon: <BarChart />,
      maxRunners: 2,
    },
    {
      type: "boxplot" as GraphType,
      label: "Gráfico de Cajas",
      description: "Distribución estadística de tiempos por control",
      icon: <ScatterPlot />,
      maxRunners: null,
    },
    {
      type: "position" as GraphType,
      label: "Evolución de Posición",
      description: "Cambio de posición por control (soporta múltiples corredores)",
      icon: <Timeline />,
      maxRunners: null, // Updated to support unlimited runners
    },
    {
      type: "heatmap" as GraphType,
      label: "Mapa de Calor",
      description: "Matriz de posiciones por corredor y control",
      icon: <GridOn />,
      maxRunners: null,
    },
  ]

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Seleccionar Tipo de Gráfico</DialogTitle>
      <DialogContent>
        <List>
          {graphOptions.map((option) => (
            <ListItem key={option.type} disablePadding>
              <ListItemButton
                selected={selectedGraph === option.type}
                onClick={() => onSelectGraph(option.type)}
              >
                <ListItemIcon>{option.icon}</ListItemIcon>
                <ListItemText
                  primary={option.label}
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {option.description}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onClose} variant="contained" disabled={!selectedGraph}>
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default GraphSelectionModal
