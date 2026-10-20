import React, { useContext } from "react"
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined"
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined"
import { useTranslation } from "react-i18next"
import { ProcessedRunnerModel } from "./shared/EntityTypes.ts"
import { VirtualTicketContext } from "./shared/context.tsx"
import { teamMemberNames } from "./shared/ticketDisplay.ts"
import VirtualTicketMetaButton from "./components/VirtualTicketMetaButton.tsx"
import VirtualTicketMetaSeparator from "./components/VirtualTicketMetaSeparator.tsx"

type VirtualTicketRunnerInfoProps = {
  runner: ProcessedRunnerModel
  setClassClubId: (newClassOrClubId: string, isClass: boolean) => void
  displayTeamMemberNames?: boolean
  showIcons?: boolean
}

/**
 * Display a runner's name, and below it the bib, class and club within a virtual ticket. The class
 * and club are buttons that close the ticket and list that class or club.
 *
 * @param props.runner Runner to be displayed.
 * @param props.setClassClubId The function to change to another class or club, used by the class
 * and club buttons.
 * @param props.displayTeamMemberNames If true, team members are listed below the name.
 * @param props.showIcons If true, the class and club carry an icon before their name.
 */
const VirtualTicketRunnerInfo: React.FC<VirtualTicketRunnerInfoProps> = ({
  runner,
  setClassClubId,
  displayTeamMemberNames,
  showIcons,
}) => {
  const { t } = useTranslation()
  const { handleClose } = useContext(VirtualTicketContext)
  const hasBib = !!runner.bib_number
  const clubName = runner.club ? runner.club.short_name : t("ResultsStage.NoClubMsg")
  const teamMembers = displayTeamMemberNames ? teamMemberNames(runner) : null
  const classIcon = showIcons ? <LeaderboardOutlinedIcon sx={{ fontSize: 16 }} /> : undefined
  const clubIcon = showIcons ? <GroupsOutlinedIcon sx={{ fontSize: 16 }} /> : undefined

  const handleClassClick = () => {
    setClassClubId(runner.class.id, true)
    handleClose()
  }
  const handleClubClick = () => {
    if (runner.club) {
      setClassClubId(runner.club.id, false)
      handleClose()
    }
  }

  return (
    <div className="virtual-ticket-runner-info flex flex-col gap-1 pr-12 sm:gap-1.5">
      <div>
        <h2 className="m-0 text-lg font-semibold leading-6 text-neutral-900 sm:text-xl sm:leading-[26px]">
          {runner.full_name}
        </h2>
        {teamMembers && <p className="m-0 mt-0.5 text-[13px] text-neutral-500">{teamMembers}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-medium">
        {hasBib && (
          <>
            <span className="tabular-nums text-neutral-500">
              {t("ResultsStage.VirtualTicket.Bib", { bib: runner.bib_number })}
            </span>
            <VirtualTicketMetaSeparator />
          </>
        )}
        <VirtualTicketMetaButton icon={classIcon} onClick={handleClassClick}>
          {runner.class.short_name}
        </VirtualTicketMetaButton>
        <VirtualTicketMetaSeparator />
        <VirtualTicketMetaButton
          icon={clubIcon}
          isDisabled={!runner.club}
          onClick={handleClubClick}
        >
          {clubName}
        </VirtualTicketMetaButton>
      </div>
    </div>
  )
}

export default VirtualTicketRunnerInfo
