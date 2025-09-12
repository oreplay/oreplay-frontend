import { createSvgIcon } from "@mui/material"

const ItalyFlag = createSvgIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 30">
    <defs>
      <mask id="roundMask">
        <rect x="0" y="0" width="50" height="30" rx="4" ry="4" fill="white" />
      </mask>
    </defs>

    <g mask="url(#roundMask)">
      <rect width="16.67" height="30" fill="#009246" />
      <rect x="16.67" width="16.67" height="30" fill="#fff" />
      <rect x="33.33" width="16.67" height="30" fill="#ce2b37" />
    </g>
  </svg>,
  "ItalyFlag",
)

export default ItalyFlag
