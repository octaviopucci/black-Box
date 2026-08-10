import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { MonthlyChartData, StatusChartData } from '@/types'
import { formatCurrency } from '@/utils'

const tooltipStyle = {
  background: '#fff',
  border: '1px solid #D5DCE6',
  borderRadius: 12,
  color: '#0C1222',
}

export function SalesChart({ data }: { data: MonthlyChartData[] }) {
  return (
    <div className="panel p-4">
      <h3 className="mb-4 font-display text-lg font-semibold tracking-wide">
        Vendas e lucro por mês
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#E8EDF3" strokeDasharray="3 3" />
            <XAxis dataKey="mes" stroke="#3D4F66" fontSize={12} />
            <YAxis stroke="#3D4F66" fontSize={12} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value, name) => {
                if (name === 'quantidade') return [Number(value ?? 0), 'Qtd. vendas']
                return [formatCurrency(Number(value ?? 0)), String(name)]
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="vendas" name="Vendas" stroke="#0F766E" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="lucro" name="Lucro" stroke="#15803D" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function StatusChart({ data }: { data: StatusChartData[] }) {
  return (
    <div className="panel p-4">
      <h3 className="mb-4 font-display text-lg font-semibold tracking-wide">Veículos por status</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="quantidade" nameKey="status" innerRadius={55} outerRadius={90} paddingAngle={3}>
              {data.map((entry) => (
                <Cell key={entry.status} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function CategoryBars({
  title,
  data,
}: {
  title: string
  data: { name: string; value: number }[]
}) {
  return (
    <div className="panel p-4">
      <h3 className="mb-4 font-display text-lg font-semibold tracking-wide">{title}</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="#3A3A3A" strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#888" fontSize={11} />
            <YAxis stroke="#888" fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value) => formatCurrency(Number(value ?? 0))} />
            <Bar dataKey="value" fill="#C41E3A" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
