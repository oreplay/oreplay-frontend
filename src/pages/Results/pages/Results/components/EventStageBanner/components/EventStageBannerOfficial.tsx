import { useTranslation } from "react-i18next"
import OfficialChip from "../../../../../../components/OfficialChip.tsx"
import { OFFICIAL_CHIP_SIZE } from "../../../../../../shared/officialChipSizes.ts"

/**
 * Compact "Official" chip in the bottom-right corner of the event stage banner, inside its padding
 * so it lines up with the banner's content edges. It tells viewers the organizer has finished the
 * stage and its results are confirmed, and explains on hover that they will no longer change. The
 * banner has to be positioned for the corner to be its own.
 */
export default function EventStageBannerOfficial() {
  const { t } = useTranslation()

  return (
    <div className="event-stage-banner-official absolute bottom-8 right-6 flex">
      <OfficialChip tooltip={t("ResultsStage.OfficialTooltip")} size={OFFICIAL_CHIP_SIZE.Compact} />
    </div>
  )
}
