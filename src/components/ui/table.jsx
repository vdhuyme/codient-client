const Table = ({ children, className = '' }) => (
  <div className="overflow-hidden rounded-xl border border-indigo-500/20 bg-slate-900/50 backdrop-blur-sm">
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
    <div className="relative z-10 overflow-x-auto">
      <table className={`w-full ${className}`}>{children}</table>
    </div>
  </div>
)

const TableHeader = ({ children, className = '' }) => <thead className={`border-b border-indigo-500/20 ${className}`}>{children}</thead>

const TableBody = ({ children, className = '' }) => <tbody className={className}>{children}</tbody>

const TableRow = ({ children, className = '', hover = true }) => (
  <tr className={`border-b border-indigo-500/10 last:border-0 ${hover ? 'hover:bg-indigo-500/5' : ''} ${className}`}>{children}</tr>
)

const TableHead = ({ children, className = '' }) => (
  <th className={`px-6 py-4 text-left text-sm font-medium text-gray-300 ${className}`}>{children}</th>
)

const TableCell = ({ children, className = '', ...props }) => (
  <td className={`px-6 py-4 text-sm text-gray-300 ${className}`} {...props}>
    {children}
  </td>
)

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell }
