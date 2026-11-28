import { useTranslationRanking } from "../../../../../../shared/useTranslationRanking.ts"
import { StatTable } from "../shared/fedoStatsTables.ts"

interface StatsTableProps {
  table: StatTable
}

export default function StatsTable({ table }: StatsTableProps) {
  const { t } = useTranslationRanking()

  return (
    <table className="rk-stats-table w-full border-collapse text-sm">
      <caption className="mb-1 text-left font-semibold text-neutral-800">
        {t(table.titleKey)}
      </caption>
      <thead>
        <tr className="border-b border-neutral-300 text-neutral-500">
          <th className="py-1 text-left font-medium" />
          <th className="py-1 text-right font-medium">{t("FedoStats.male")}</th>
          <th className="py-1 text-right font-medium">{t("FedoStats.female")}</th>
          <th className="py-1 text-right font-medium">{t("FedoStats.total")}</th>
        </tr>
      </thead>
      <tbody>
        {table.rows.map((r) => (
          <tr key={r.labelKey} className="border-b border-neutral-100">
            <td className="py-1 pr-4">{t(r.labelKey)}</td>
            <td className="py-1 text-right tabular-nums">{r.M}</td>
            <td className="py-1 text-right tabular-nums">{r.F}</td>
            <td className="py-1 text-right font-medium tabular-nums">{r.total}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
