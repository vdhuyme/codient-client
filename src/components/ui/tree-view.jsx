import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ChevronRight, ChevronsUpDown, ChevronsDownUp } from 'lucide-react'
import Badge from './badge'

const TreeNode = ({ node, level = 0, onSelect, onEdit, onDelete, onAddChild, onToggleStatus, selectedId, expandedNodes, onToggleExpand }) => {
  const hasChildren = node.children && node.children.length > 0
  const isExpanded = expandedNodes.has(node.id)
  const isSelected = selectedId === node.id

  const handleToggle = () => {
    if (hasChildren) {
      onToggleExpand(node.id)
    }
  }

  const handleSelect = () => {
    onSelect(node)
  }

  return (
    <div className="select-none">
      <motion.div
        className={`group flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 transition-all duration-200 ${
          isSelected ? 'border border-indigo-500/30 bg-indigo-500/20 text-indigo-300' : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
        } `}
        style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
        onClick={handleSelect}
        layout
      >
        {/* Expand/Collapse Button */}
        <div className="flex h-4 w-4 items-center justify-center">
          {hasChildren ? (
            <motion.button
              onClick={(e) => {
                e.stopPropagation()
                handleToggle()
              }}
              className="text-gray-400 transition-colors hover:text-gray-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronRight className="h-3 w-3" />
              </motion.div>
            </motion.button>
          ) : (
            <div className="h-3 w-3" />
          )}
        </div>

        {/* Name and Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium">{node.name}</span>
            <Badge variant={node.status === 'published' ? 'success' : 'warning'} size="sm">
              {node.status}
            </Badge>
            {hasChildren && <span className="text-xs text-gray-500">({node.children.length})</span>}
          </div>
          {node.description && <p className="mt-0.5 truncate text-xs text-gray-400">{node.description}</p>}
        </div>
      </motion.div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onSelect={onSelect}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
              onToggleStatus={onToggleStatus}
              selectedId={selectedId}
              expandedNodes={expandedNodes}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </motion.div>
      )}
    </div>
  )
}

const TreeView = ({ data, onSelect, onEdit, onDelete, onAddChild, onToggleStatus, selectedId, className = '' }) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set())

  const handleToggleExpand = (nodeId) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const expandAll = () => {
    const getAllNodeIds = (nodes) => {
      let ids = []
      nodes.forEach((node) => {
        ids.push(node.id)
        if (node.children) {
          ids = ids.concat(getAllNodeIds(node.children))
        }
      })
      return ids
    }
    setExpandedNodes(new Set(getAllNodeIds(data)))
  }

  const collapseAll = () => {
    setExpandedNodes(new Set())
  }

  const [isExpanded, setIsExpanded] = useState(false)
  const toggleExpandCollapse = () => {
    if (isExpanded) {
      collapseAll()
    } else {
      expandAll()
    }
    setIsExpanded(!isExpanded)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Tree Controls */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-300">Category Tree</h3>
        <div className="flex items-center gap-2">
          <button onClick={toggleExpandCollapse} className="hover:bg-muted text-muted-foreground rounded-md p-2 text-white transition-colors">
            {isExpanded ? <ChevronsDownUp className="h-4 w-4" /> : <ChevronsUpDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Tree Nodes */}
      <div className="space-y-1">
        {data.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            onSelect={onSelect}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddChild={onAddChild}
            onToggleStatus={onToggleStatus}
            selectedId={selectedId}
            expandedNodes={expandedNodes}
            onToggleExpand={handleToggleExpand}
          />
        ))}
      </div>

      {data.length === 0 && (
        <div className="py-8 text-center text-gray-400">
          <div className="mb-2 text-4xl">📁</div>
          <p className="text-sm">No categories yet</p>
          <p className="text-xs">Create your first category to get started</p>
        </div>
      )}
    </div>
  )
}

export default TreeView
