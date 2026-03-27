import { createSvgIcon } from "@mui/material"

const UsFlag = createSvgIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 30">
    <defs>
      <mask id="roundMask">
        <rect x="0" y="0" width="50" height="30" rx="4" ry="4" fill="white" />
      </mask>
    </defs>

    <g mask="url(#roundMask)">
      {/* Stripes */}
      <path fill="#B22234" d="M0 0h50v2.3077H0z" />
      <path fill="#FFF" d="M0 2.3077h50v2.3077H0z" />
      <path fill="#B22234" d="M0 4.6154h50v2.3077H0z" />
      <path fill="#FFF" d="M0 6.9231h50v2.3077H0z" />
      <path fill="#B22234" d="M0 9.2308h50v2.3077H0z" />
      <path fill="#FFF" d="M0 11.5385h50v2.3077H0z" />
      <path fill="#B22234" d="M0 13.8462h50v2.3077H0z" />
      <path fill="#FFF" d="M0 16.1538h50v2.3077H0z" />
      <path fill="#B22234" d="M0 18.4615h50v2.3077H0z" />
      <path fill="#FFF" d="M0 20.7692h50v2.3077H0z" />
      <path fill="#B22234" d="M0 23.0769h50v2.3077H0z" />
      <path fill="#FFF" d="M0 25.3846h50v2.3077H0z" />
      <path fill="#B22234" d="M0 27.6923h50v2.3077H0z" />

      {/* Blue canton */}
      <rect x="0" y="0" width="21" height="13.8462" fill="#3C3B6E" />

      {/* Stars (simplified as small circles in a grid) */}
      {Array.from({ length: 9 }).map((_, row) =>
        Array.from({ length: 6 }).map((_, col) => {
          const x = 1.75 + col * 3.0 + (row % 2 ? 1.5 : 0) // offset every other row
          const y = 1.5 + row * 1.5
          return <circle key={`${row}-${col}`} cx={x} cy={y} r={0.6} fill="#FFF" />
        }),
      )}
    </g>
  </svg>,
  "UsFlag",
)

export default UsFlag
