import { createSvgIcon } from "@mui/material"

const ItalyFlag = createSvgIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
    <defs>
      <clipPath id="roundClip">
        <rect x="0" y="0" width="900" height="600" rx="80" ry="80" />
      </clipPath>
    </defs>

    <g clipPath="url(#roundClip)">
      <path fill="#009246" d="M0 0h3v2H0z" />
      <path fill="#fff" d="M1 0h2v2H1z" />
      <path fill="#ce2b37" d="M2 0h1v2H2z" />
    </g>
  </svg>,
  "ItalyFlag",
)

export default ItalyFlag
