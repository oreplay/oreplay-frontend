import { createSvgIcon } from "@mui/material";

const SpainFlag = createSvgIcon(
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
        <defs>
            <clipPath id="roundClip">
                <rect x="0" y="0" width="900" height="600" rx="80" ry="80" />
            </clipPath>
        </defs>

        <g clipPath="url(#roundClip)">
            <rect width="900" height="150" fill="#AA151B" />
            <rect y="150" width="900" height="300" fill="#F1BF00" />
            <rect y="450" width="900" height="150" fill="#AA151B" />
        </g>
    </svg>,
    "SpainFlag"
);

export default SpainFlag;
