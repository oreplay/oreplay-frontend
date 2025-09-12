import { createSvgIcon } from "@mui/material"

const HungaryFlag = createSvgIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 30">
    <defs>
      <mask id="roundMask">
        <rect x="0" y="0" width="50" height="30" rx="4" ry="4" fill="white" />
      </mask>
    </defs>

    <g mask="url(#roundMask)">
      <rect width="50" height="10" fill="#CD212A" />
      <rect y="10" width="50" height="10" fill="#fff" />
      <rect y="20" width="50" height="10" fill="#00843D" />
    </g>
  </svg>,
  "HungaryFlag",
)

export default HungaryFlag