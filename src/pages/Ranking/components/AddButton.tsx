import { ButtonHTMLAttributes } from "react"
import { useTranslationRanking } from "../shared/useTranslationRanking.ts"
import PrimaryButton from "./PrimaryButton.tsx"

type AddButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">

export default function AddButton(props: AddButtonProps) {
  const { t } = useTranslationRanking()
  return <PrimaryButton {...props}>{t("common:addNew")}</PrimaryButton>
}
