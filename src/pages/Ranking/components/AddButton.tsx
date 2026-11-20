import { ButtonHTMLAttributes } from "react"
import { useTranslation } from "react-i18next"
import PrimaryButton from "./PrimaryButton.tsx"

type AddButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">

export default function AddButton(props: AddButtonProps) {
  const { t } = useTranslation()
  return <PrimaryButton {...props}>{t("common:addNew")}</PrimaryButton>
}
