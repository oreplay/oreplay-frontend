import { createSvgIcon } from "@mui/material"

const HungaryFlag = createSvgIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
    <defs>
      <clipPath id="roundClip">
        <rect x="0" y="0" width="900" height="600" rx="80" ry="80" />
      </clipPath>
    </defs>

    <g clipPath="url(#roundClip)">
      <path fill="#477050" d="M0 0h1200v600H0" />
      <path fill="#fff" d="M0 0h1200v400H0" />
      <path fill="#ce2939" d="M0 0h1200v200H0" />
    </g>
  </svg>,
  "HungaryFlag",
)

export default HungaryFlag
