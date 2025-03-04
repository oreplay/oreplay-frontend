interface GithubProperty {
  property_name: string
  value: never
}

const CLIENT_VERSION_PROPERTY_NAME = "oreplaydesktopclientver"

export default async function getLatestClientVersion(): Promise<string> {
  // eslint-disable-next-line
  const response: GithubProperty[] = await fetch(
    "https://api.github.com/repos/oreplay/desktop-client/properties/values",
    {
      method: "GET",
    },
  ).then((response) => response.json())

  const property = response.find(
    (property) => property.property_name == CLIENT_VERSION_PROPERTY_NAME,
  )

  if (property) {
    const regex = /^v(\d+\.\d+\.\d+)$/
    const match = regex.exec(property.value)

    if (match?.[1]) {
      return match[1]
    } else {
      throw new Error("The version number doesn't match the pattern vX.X.X")
    }
  } else {
    throw Error("Client version not found in github properties for the client repository")
  }
}
