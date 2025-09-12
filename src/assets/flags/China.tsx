import { createSvgIcon } from "@mui/material"

const ChinaFlag = createSvgIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
    <defs>
      <clipPath id="roundClip">
        <rect x="0" y="0" width="900" height="600" rx="80" ry="80" />
      </clipPath>
    </defs>

    <g clipPath="url(#roundClip)">
      <path fill="#EE1C25" d="M0 0h900v600H0" />
      <g transform="matrix(3 0 0 3 150 150)">
        <path id="a" fill="#FF0" d="m0-30 17.634 54.27-46.166-33.54h57.064l-46.166 33.54Z" />
      </g>
      <use xlinkHref="#a" transform="rotate(23.036 2.784 766.082)" />
      <use xlinkHref="#a" transform="rotate(45.87 38.201 485.396)" />
      <use xlinkHref="#a" transform="rotate(69.945 29.892 362.328)" />
      <use xlinkHref="#a" transform="rotate(20.66 -590.66 957.955)" />
    </g>
  </svg>,
  "ChinaFlag",
)

export default ChinaFlag
