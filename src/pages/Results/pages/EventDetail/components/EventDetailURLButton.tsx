import {Button} from "@mui/material";
import {Launch} from "@mui/icons-material";
import React from "react";


interface MyComponentProps {
  url: string|undefined,
  marginLeft?:string,
  marginRight?:string,
}

const EditeDetailURLButton: React.FC<MyComponentProps> = ({ url,marginLeft, marginRight }) => {

  // Check if there is an URL
  if (url) {
    try {

      // Check if protocol is missing (starts with `//` or does not contain `://`)
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }

      // Create URL object
      const urlObject = new URL(url);

      // return button
      return (
        <Button
          style={{
            "marginLeft": marginLeft,
            "marginRight": marginRight
          }}
          sx={{
            width: "min-content",
            marginTop: "12px",
            textTransform: "lowercase",
            paddingX:0
          }}
          variant="text"
          onClick={() => {
            window.open(urlObject, '_blank', 'noopener,noreferrer')
          }}
          endIcon={<Launch/>}>
          {urlObject.hostname}
        </Button>
      )

      // if URL is invalid don't render anything
    } catch {
      return (<></>)
    }

  // if URL not provided don't render anything
  } else {
    return (<></>)
  }
}

export default EditeDetailURLButton;