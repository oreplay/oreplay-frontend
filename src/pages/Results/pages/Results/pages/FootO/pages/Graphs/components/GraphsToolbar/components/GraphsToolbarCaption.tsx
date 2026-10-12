import { useTranslation } from "react-i18next"
import {
  GRAPH_VIEW_DESCRIPTION_KEY,
  GRAPH_VIEW_TITLE_KEY,
  GraphView,
} from "../../../shared/graphViews.ts"
import GraphDescription from "./GraphDescription.tsx"

interface GraphsToolbarCaptionProps {
  view: GraphView
}

/**
 * Names the graph on screen and offers its explanation. The name is only written on small screens,
 * where the selector has no room for it; the info icon with the explanation is always there.
 *
 * @param props.view The graph currently shown.
 */
export default function GraphsToolbarCaption({ view }: GraphsToolbarCaptionProps) {
  const { t } = useTranslation()

  return (
    <div className="graphs-toolbar-caption relative flex items-center gap-1">
      <p className="graphs-toolbar-title m-0 pl-1 text-left text-sm font-bold text-neutral-800 sm:hidden">
        {t(GRAPH_VIEW_TITLE_KEY[view])}
      </p>
      <GraphDescription
        description={t(GRAPH_VIEW_DESCRIPTION_KEY[view])}
        label={t("Graphs.DescriptionLabel")}
      />
    </div>
  )
}
