import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, Settings } from 'lucide-react'

import Avatar from '@/components/ui/avatar'
import Badge from '@/components/ui/badge'
import Button from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import Checkbox from '@/components/ui/checkbox'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import Select from '@/components/ui/select'
import Switch from '@/components/ui/switch'
import Textarea from '@/components/ui/textarea'
import Tooltip from '@/components/ui/tooltip'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import Pagination from '@/components/ui/pagination'

const StatsPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [switchValue, setSwitchValue] = useState(false)
  const [checkboxValue, setCheckboxValue] = useState(false)
  const [selectValue, setSelectValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const selectOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ]

  const tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor' }
  ]

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      {/* Background effects */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 80%, rgba(79, 70, 229, 0.15), transparent 50%), radial-gradient(circle at 80% 20%, rgba(124, 58, 237, 0.15), transparent 50%)'
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl space-y-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-4xl font-bold text-transparent">Elegant UI Components</h1>
          <p className="mt-4 text-gray-400">A comprehensive collection of beautiful, animated components</p>
        </motion.div>

        {/* Avatars & Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Avatars & Badges</CardTitle>
            <CardDescription>User avatars and status indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-6">
              <div className="space-y-2">
                <Label>Avatars</Label>
                <div className="flex items-center space-x-4">
                  <Avatar size="sm" />
                  <Avatar size="md" showBorder />
                  <Avatar size="lg" src="/placeholder.svg?height=48&width=48" />
                  <Avatar size="xl" fallback="JD" showBorder />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Badges</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="error">Error</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>Interactive button components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button loading>Loading</Button>
            </div>
          </CardContent>
        </Card>

        {/* Form Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Form Controls</CardTitle>
            <CardDescription>Input fields and form elements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <Label required>Email</Label>
                  <Input type="email" placeholder="Enter your email" icon={<Mail className="h-4 w-4" />} />
                </div>

                <div>
                  <Label>Phone</Label>
                  <Input type="tel" placeholder="Enter phone number" icon={<Phone className="h-4 w-4" />} />
                </div>

                <div>
                  <Label>Country</Label>
                  <Select options={selectOptions} value={selectValue} onChange={setSelectValue} placeholder="Select country" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Message</Label>
                  <Textarea placeholder="Enter your message" rows={4} />
                </div>

                <div className="space-y-3">
                  <Checkbox
                    checked={checkboxValue}
                    onChange={(e) => setCheckboxValue(e.target.checked)}
                    label="I agree to the terms and conditions"
                  />

                  <Switch checked={switchValue} onChange={(e) => setSwitchValue(e.target.checked)} label="Enable notifications" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Tabs</CardTitle>
            <CardDescription>Tabbed navigation component</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profile">
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <div className="rounded-lg bg-slate-800/30 p-4">
                  <h3 className="mb-2 font-medium text-white">Profile Settings</h3>
                  <p className="text-gray-400">Manage your profile information and preferences.</p>
                </div>
              </TabsContent>

              <TabsContent value="settings">
                <div className="rounded-lg bg-slate-800/30 p-4">
                  <h3 className="mb-2 font-medium text-white">Account Settings</h3>
                  <p className="text-gray-400">Configure your account settings and security options.</p>
                </div>
              </TabsContent>

              <TabsContent value="notifications">
                <div className="rounded-lg bg-slate-800/30 p-4">
                  <h3 className="mb-2 font-medium text-white">Notification Preferences</h3>
                  <p className="text-gray-400">Choose how you want to receive notifications.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Data Table</CardTitle>
            <CardDescription>Elegant data presentation</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow hover={false}>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar
                          size="sm"
                          fallback={user.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        />
                        <span className="font-medium text-white">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'Admin' ? 'success' : 'default'}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Tooltip content="Edit user">
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-6">
              <Pagination currentPage={currentPage} totalPages={5} onPageChange={setCurrentPage} />
            </div>
          </CardContent>
        </Card>

        {/* Dialog & Tooltip Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Dialog & Tooltip</CardTitle>
            <CardDescription>Modal dialogs and helpful tooltips</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>

              <Tooltip content="This is a helpful tooltip">
                <Button variant="outline">Hover for tooltip</Button>
              </Tooltip>
            </div>
          </CardContent>
        </Card>

        {/* Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogClose onClose={() => setDialogOpen(false)} />
            <DialogHeader>
              <DialogTitle>Confirm Action</DialogTitle>
              <DialogDescription>Are you sure you want to perform this action? This cannot be undone.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => setDialogOpen(false)}>
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default StatsPage
