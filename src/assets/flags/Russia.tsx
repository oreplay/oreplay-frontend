import { createSvgIcon } from "@mui/material"

const RussiaFlag = createSvgIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
    <defs>
      <clipPath id="roundClip">
        <rect x="0" y="0" width="900" height="600" rx="80" ry="80" />
      </clipPath>
    </defs>

    <g clipPath="url(#roundClip)">
      <path fill="#fff" d="M0 0h9v3H0z" />
      <path fill="#d52b1e" d="M0 3h9v3H0z" />
      <path fill="#0039a6" d="M0 2h9v2H0z" />
    </g>
  </svg>,
  "RussiaFlag",
)

export default RussiaFlag
