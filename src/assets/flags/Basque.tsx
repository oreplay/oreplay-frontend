import { createSvgIcon } from "@mui/material"

const BasqueFlag = createSvgIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 30">
    <defs>
      <mask id="roundMask">
        <rect x="0" y="0" width="50" height="30" rx="4" ry="4" fill="white" />
      </mask>
    </defs>

    <g mask="url(#roundMask)">
      <path fill="#D52B1E" d="M0 0v28h50V0z" />
      <path stroke="#009B48" strokeWidth={4.3} d="m0 0 50 28m0-28L0 28" />
      <path stroke="#fff" strokeWidth={4.3} d="M25 0v28M0 14h50" />
    </g>
  </svg>,
  "BasqueFlag",
)

export default BasqueFlag
