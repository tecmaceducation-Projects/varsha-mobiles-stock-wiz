import { useState } from "react";
import { Plus, Edit, Trash2, Users, UserCheck, UserX, ClipboardList, CalendarDays, CheckCircle2, Clock, AlertCircle, CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useStaff } from "@/contexts/StaffContext";
import { useToast } from "@/hooks/use-toast";
import TaskCalendar from "@/components/TaskCalendar";

const StaffManagement = () => {
  const { staff, tasks, addStaff, updateStaff, deleteStaff, addTask, updateTask, deleteTask } = useStaff();
  const { toast } = useToast();
  const [isStaffDialogOpen, setIsStaffDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<string | null>(null);

  const [staffForm, setStaffForm] = useState({ name: "", role: "", email: "", phone: "", department: "", joinDate: "", status: "active" as "active" | "inactive" });
  const [taskForm, setTaskForm] = useState({ title: "", description: "", assignedTo: "", dueDate: "", status: "pending" as "pending" | "in-progress" | "completed" | "overdue", priority: "medium" as "low" | "medium" | "high" });

  const resetStaffForm = () => setStaffForm({ name: "", role: "", email: "", phone: "", department: "", joinDate: "", status: "active" });
  const resetTaskForm = () => setTaskForm({ title: "", description: "", assignedTo: "", dueDate: "", status: "pending", priority: "medium" });

  const handleStaffSubmit = () => {
    if (!staffForm.name || !staffForm.role) { toast({ title: "Error", description: "Name and role are required", variant: "destructive" }); return; }
    if (editingStaff) {
      updateStaff(editingStaff, staffForm);
      toast({ title: "Staff Updated", description: `${staffForm.name} has been updated` });
    } else {
      addStaff(staffForm);
      toast({ title: "Staff Added", description: `${staffForm.name} has been added to the team` });
    }
    resetStaffForm(); setEditingStaff(null); setIsStaffDialogOpen(false);
  };

  const handleTaskSubmit = () => {
    if (!taskForm.title || !taskForm.assignedTo) { toast({ title: "Error", description: "Title and assignee are required", variant: "destructive" }); return; }
    if (editingTask) {
      updateTask(editingTask, taskForm);
      toast({ title: "Task Updated", description: `"${taskForm.title}" has been updated` });
    } else {
      addTask(taskForm);
      toast({ title: "Task Created", description: `"${taskForm.title}" has been assigned` });
    }
    resetTaskForm(); setEditingTask(null); setIsTaskDialogOpen(false);
  };

  const handleEditStaff = (member: typeof staff[0]) => {
    setStaffForm({ name: member.name, role: member.role, email: member.email, phone: member.phone, department: member.department, joinDate: member.joinDate, status: member.status });
    setEditingStaff(member.id); setIsStaffDialogOpen(true);
  };

  const handleEditTask = (task: typeof tasks[0]) => {
    setTaskForm({ title: task.title, description: task.description, assignedTo: task.assignedTo, dueDate: task.dueDate, status: task.status, priority: task.priority });
    setEditingTask(task.id); setIsTaskDialogOpen(true);
  };

  const getStaffName = (id: string) => staff.find(s => s.id === id)?.name || "Unassigned";

  const activeStaff = staff.filter(s => s.status === "active").length;
  const pendingTasks = tasks.filter(t => t.status === "pending").length;
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const highPriorityTasks = tasks.filter(t => t.priority === "high" && t.status !== "completed").length;

  const priorityColor = (p: string) => p === "high" ? "destructive" : p === "medium" ? "default" : "secondary";
  const statusColor = (s: string) => s === "completed" ? "default" : s === "in-progress" ? "secondary" : s === "overdue" ? "destructive" : "outline";

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-text bg-clip-text text-transparent">Staff & Task Management</h1>
          <p className="text-muted-foreground">Manage employees and assign tasks efficiently</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Staff</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{staff.length}</div><p className="text-xs text-muted-foreground">{activeStaff} active</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Pending Tasks</CardTitle><Clock className="h-4 w-4 text-warning" /></CardHeader><CardContent><div className="text-2xl font-bold text-warning">{pendingTasks}</div><p className="text-xs text-muted-foreground">Awaiting action</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Completed Tasks</CardTitle><CheckCircle2 className="h-4 w-4 text-success" /></CardHeader><CardContent><div className="text-2xl font-bold text-success">{completedTasks}</div><p className="text-xs text-muted-foreground">This period</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">High Priority</CardTitle><AlertCircle className="h-4 w-4 text-destructive" /></CardHeader><CardContent><div className="text-2xl font-bold text-destructive">{highPriorityTasks}</div><p className="text-xs text-muted-foreground">Need attention</p></CardContent></Card>
      </div>

      <Tabs defaultValue="staff" className="space-y-4">
        <TabsList>
          <TabsTrigger value="staff"><Users className="w-4 h-4 mr-2" />Staff Directory</TabsTrigger>
          <TabsTrigger value="tasks"><ClipboardList className="w-4 h-4 mr-2" />Task Board</TabsTrigger>
          <TabsTrigger value="calendar"><CalendarRange className="w-4 h-4 mr-2" />Calendar</TabsTrigger>
        </TabsList>

        {/* Staff Tab */}
        <TabsContent value="staff" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isStaffDialogOpen} onOpenChange={(open) => { setIsStaffDialogOpen(open); if (!open) { resetStaffForm(); setEditingStaff(null); } }}>
              <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Add Staff</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>{editingStaff ? "Edit Staff" : "Add New Staff"}</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Full Name</Label><Input value={staffForm.name} onChange={e => setStaffForm({ ...staffForm, name: e.target.value })} placeholder="Enter name" /></div>
                    <div><Label>Role</Label><Input value={staffForm.role} onChange={e => setStaffForm({ ...staffForm, role: e.target.value })} placeholder="Enter role" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Email</Label><Input type="email" value={staffForm.email} onChange={e => setStaffForm({ ...staffForm, email: e.target.value })} placeholder="Enter email" /></div>
                    <div><Label>Phone</Label><Input value={staffForm.phone} onChange={e => setStaffForm({ ...staffForm, phone: e.target.value })} placeholder="Enter phone" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Department</Label>
                      <Select value={staffForm.department} onValueChange={v => setStaffForm({ ...staffForm, department: v })}>
                        <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Management">Management</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                          <SelectItem value="Inventory">Inventory</SelectItem>
                          <SelectItem value="Billing">Billing</SelectItem>
                          <SelectItem value="Support">Support</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label>Join Date</Label><Input type="date" value={staffForm.joinDate} onChange={e => setStaffForm({ ...staffForm, joinDate: e.target.value })} /></div>
                  </div>
                  <div><Label>Status</Label>
                    <Select value={staffForm.status} onValueChange={v => setStaffForm({ ...staffForm, status: v as "active" | "inactive" })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleStaffSubmit}>{editingStaff ? "Update Staff" : "Add Staff"}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead><TableHead>Role</TableHead><TableHead>Department</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff.map(member => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>{member.department}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.phone}</TableCell>
                      <TableCell><Badge variant={member.status === "active" ? "default" : "secondary"}>{member.status === "active" ? <><UserCheck className="w-3 h-3 mr-1" />Active</> : <><UserX className="w-3 h-3 mr-1" />Inactive</>}</Badge></TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditStaff(member)}><Edit className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => { deleteStaff(member.id); toast({ title: "Staff Removed", description: `${member.name} has been removed` }); }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isTaskDialogOpen} onOpenChange={(open) => { setIsTaskDialogOpen(open); if (!open) { resetTaskForm(); setEditingTask(null); } }}>
              <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Create Task</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>{editingTask ? "Edit Task" : "Create New Task"}</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4">
                  <div><Label>Task Title</Label><Input value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} placeholder="Enter task title" /></div>
                  <div><Label>Description</Label><Textarea value={taskForm.description} onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} placeholder="Enter task description" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Assign To</Label>
                      <Select value={taskForm.assignedTo} onValueChange={v => setTaskForm({ ...taskForm, assignedTo: v })}>
                        <SelectTrigger><SelectValue placeholder="Select staff" /></SelectTrigger>
                        <SelectContent>{staff.filter(s => s.status === "active").map(s => (<SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>))}</SelectContent>
                      </Select>
                    </div>
                    <div><Label>Due Date</Label><Input type="date" value={taskForm.dueDate} onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Priority</Label>
                      <Select value={taskForm.priority} onValueChange={v => setTaskForm({ ...taskForm, priority: v as "low" | "medium" | "high" })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div><Label>Status</Label>
                      <Select value={taskForm.status} onValueChange={v => setTaskForm({ ...taskForm, status: v as any })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="pending">Pending</SelectItem><SelectItem value="in-progress">In Progress</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={handleTaskSubmit}>{editingTask ? "Update Task" : "Create Task"}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead><TableHead>Assigned To</TableHead><TableHead>Due Date</TableHead><TableHead>Priority</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map(task => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div><span className="font-medium">{task.title}</span><p className="text-xs text-muted-foreground">{task.description}</p></div>
                      </TableCell>
                      <TableCell>{getStaffName(task.assignedTo)}</TableCell>
                      <TableCell><div className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{task.dueDate}</div></TableCell>
                      <TableCell><Badge variant={priorityColor(task.priority)}>{task.priority}</Badge></TableCell>
                      <TableCell><Badge variant={statusColor(task.status)}>{task.status}</Badge></TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditTask(task)}><Edit className="w-4 h-4" /></Button>
                          {task.status !== "completed" && (
                            <Button variant="ghost" size="icon" onClick={() => { updateTask(task.id, { status: "completed" }); toast({ title: "Task Completed", description: `"${task.title}" marked as completed` }); }}><CheckCircle2 className="w-4 h-4 text-success" /></Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => { deleteTask(task.id); toast({ title: "Task Deleted" }); }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar">
          <TaskCalendar />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffManagement;
