import ChooseClassMsg from "../../../../components/ChooseClassMsg.tsx"
import HorizontalScrollGroupProvider from "../../components/HorizontalScrollGroupProvider.tsx"
import FootOResultsContent from "./components/FootOResultsContent.tsx"
import { FootOResultProps } from "./shared/footOResultProps.ts"

export default function FootOResults(props: FootOResultProps) {
  if (!props.activeItem) {
    return <ChooseClassMsg />
  }

  return (
    <HorizontalScrollGroupProvider>
      <FootOResultsContent {...props} />
    </HorizontalScrollGroupProvider>
  )
}
