import { createSvgIcon } from "@mui/material"

const PolandFlag = createSvgIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 30">
    <defs>
      <mask id="roundMask">
        <rect x="0" y="0" width="50" height="30" rx="4" ry="4" fill="white" />
      </mask>
    </defs>

    <g mask="url(#roundMask)">
      <rect width="50" height="15" fill="#fff" />
      <rect y="15" width="50" height="15" fill="#dc143c" />
    </g>
  </svg>,
  "PolandFlag",
)

export default PolandFlag
