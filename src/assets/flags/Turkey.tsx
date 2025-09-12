import { createSvgIcon } from "@mui/material"

const TurkeyFlag = createSvgIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 30">
    <defs>
      <mask id="roundMask">
        <rect x="0" y="0" width="50" height="30" rx="4" ry="4" fill="white" />
      </mask>
    </defs>

    <g mask="url(#roundMask)">
      <rect fill="#e30a17" width="50" height="30" />
      <path
        fill="#fff"
        d="m23.19 15 7.54-2.45-4.66 6.42V12.03l4.66 6.42zm.51 4.46a8.33 8.33 0 1 1 0-8.92 6.67 6.67 0 1 0 0 8.92z"
      />
    </g>
  </svg>,
  "TurkeyFlag",
)

export default TurkeyFlag