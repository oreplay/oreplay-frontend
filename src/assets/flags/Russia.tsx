import { createSvgIcon } from "@mui/material"

const RussiaFlag = createSvgIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 30">
    <defs>
      <mask id="roundMask">
        <rect x="0" y="0" width="50" height="30" rx="4" ry="4" fill="white" />
      </mask>
    </defs>

    <g mask="url(#roundMask)">
      <rect width="50" height="10" fill="#fff" />
      <rect y="10" width="50" height="10" fill="#0039a6" />
      <rect y="20" width="50" height="10" fill="#d52b1e" />
    </g>
  </svg>,
  "RussiaFlag",
)

export default RussiaFlag
