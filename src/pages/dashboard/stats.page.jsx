import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Users, Eye } from 'lucide-react'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import { Tooltip } from 'react-tooltip'
import { format, startOfYear } from 'date-fns'
import { useGA4s } from '@/hooks/use.stats'
import Input from '@/components/ui/input'
import DateInput from '@/components/ui/date-input'

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const StatsPage = () => {
  const [dateRange, setDateRange] = useState({
    from: format(startOfYear(new Date()), 'yyyy-MM-dd'),
    to: format(new Date(), 'yyyy-MM-dd')
  })

  const ga4Params = useMemo(
    () => ({
      startAt: dateRange.from,
      endAt: dateRange.to
    }),
    [dateRange]
  )

  const { data: stats = [] } = useGA4s(ga4Params)
  const data = stats.map((stat) => {
    if (stat.country === 'United States') {
      return { ...stat, country: 'United States of America' }
    }
    return stat
  })

  const totalActiveUsers = data.reduce((sum, stat) => sum + stat.activeUsers, 0)
  const totalPageViews = data.reduce((sum, stat) => sum + stat.pageViews, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
          <p className="mt-2 text-gray-400">View your website analytics and statistics</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <DateInput
            min="2019-01-01"
            max="2025-12-31"
            value={dateRange.from}
            onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))}
          />
          <DateInput
            min={dateRange.from}
            max={format(new Date(), 'yyyy-MM-dd')}
            value={dateRange.to}
            onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))}
          />
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[
          {
            label: 'Total Active Users',
            value: totalActiveUsers,
            color: 'indigo',
            icon: Users
          },
          {
            label: 'Total Page Views',
            value: totalPageViews,
            color: 'yellow',
            icon: Eye
          }
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card hover>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="py-4">
                      <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                      <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div className={`h-12 w-12 rounded-lg bg-${stat.color}-500/20 flex items-center justify-center`}>
                      <Icon className={`h-6 w-6 text-${stat.color}-500`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Map */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>View user distribution across countries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full pb-[60%]">
              <div className="absolute top-0 left-0 h-full w-full">
                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={{ scale: 130 }}
                  width={undefined}
                  height={undefined}
                  style={{ width: '100%', height: '100%' }}
                >
                  <ZoomableGroup>
                    <Geographies geography={geoUrl}>
                      {({ geographies }) =>
                        geographies?.map((geo) => {
                          const stat = data.find((s) => s.country === geo.properties.name)
                          return (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              fill={stat ? '#3b82f6' : '#1e293b'}
                              stroke="#334155"
                              strokeWidth={0.5}
                              style={{
                                default: { outline: 'none' },
                                hover: { fill: '#22c55e', outline: 'none' },
                                pressed: { outline: 'none' }
                              }}
                              data-tooltip-id={`tooltip-${geo.rsmKey}`}
                            >
                              <title>
                                {geo.properties.name}
                                {stat ? ` - ${stat.pageViews} page view(s) - ${stat.activeUsers} active user(s)` : ' - No data'}
                              </title>
                            </Geography>
                          )
                        })
                      }
                    </Geographies>
                  </ZoomableGroup>
                </ComposableMap>
                <Tooltip id="tooltip" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default StatsPage
