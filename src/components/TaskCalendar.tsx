import { useState, useMemo, DragEvent } from "react";
import { ChevronLeft, ChevronRight, Clock, AlertCircle, CheckCircle2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStaff, Task } from "@/contexts/StaffContext";
import { useToast } from "@/hooks/use-toast";

const TaskCalendar = () => {
  const { tasks, staff, updateTask } = useStaff();
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const getStaffName = (id: string) => staff.find(s => s.id === id)?.name || "Unassigned";

  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    tasks.forEach(task => {
      if (!map[task.dueDate]) map[task.dueDate] = [];
      map[task.dueDate].push(task);
    });
    return map;
  }, [tasks]);

  const statusIcon = (status: string) => {
    if (status === "completed") return <CheckCircle2 className="w-3 h-3 text-success shrink-0" />;
    if (status === "in-progress") return <Clock className="w-3 h-3 text-accent shrink-0" />;
    return <AlertCircle className="w-3 h-3 text-warning shrink-0" />;
  };

  const priorityDot = (p: string) => {
    const color = p === "high" ? "bg-destructive" : p === "medium" ? "bg-accent" : "bg-muted-foreground";
    return <span className={`w-1.5 h-1.5 rounded-full ${color} shrink-0`} />;
  };

  // Drag handlers
  const handleDragStart = (e: DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", task.id);
  };

  const handleDragOver = (e: DragEvent, dateStr: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverDate(dateStr);
  };

  const handleDragLeave = () => {
    setDragOverDate(null);
  };

  const handleDrop = (e: DragEvent, dateStr: string) => {
    e.preventDefault();
    setDragOverDate(null);
    if (draggedTask && draggedTask.dueDate !== dateStr) {
      updateTask(draggedTask.id, { dueDate: dateStr });
      toast({
        title: "Task Rescheduled",
        description: `"${draggedTask.title}" moved to ${dateStr}`,
      });
    }
    setDraggedTask(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverDate(null);
  };

  const days = [];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = 0; i < firstDayOfMonth; i++) {
    const emptyDateStr = `empty-${i}`;
    days.push(
      <div
        key={emptyDateStr}
        className="min-h-[100px] bg-muted/30 rounded-lg"
        onDragOver={(e) => e.preventDefault()}
      />
    );
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayTasks = tasksByDate[dateStr] || [];
    const isToday = new Date().toISOString().split("T")[0] === dateStr;
    const isDragOver = dragOverDate === dateStr;

    days.push(
      <div
        key={day}
        className={`min-h-[100px] rounded-lg border p-1.5 transition-all duration-200 ${
          isDragOver
            ? "border-primary border-dashed bg-primary/10 scale-[1.02]"
            : isToday
            ? "border-primary bg-primary/5"
            : "border-border bg-card"
        }`}
        onDragOver={(e) => handleDragOver(e, dateStr)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, dateStr)}
      >
        <div className={`text-xs font-semibold mb-1 ${isToday ? "text-primary" : "text-foreground"}`}>
          {day}
        </div>
        <div className="space-y-0.5">
          {dayTasks.slice(0, 3).map(task => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-1 text-[10px] p-1 rounded leading-tight cursor-grab active:cursor-grabbing select-none transition-all ${
                draggedTask?.id === task.id
                  ? "opacity-40 bg-primary/20"
                  : "bg-secondary/50 hover:bg-secondary/80 hover:shadow-sm"
              }`}
            >
              <GripVertical className="w-2.5 h-2.5 text-muted-foreground shrink-0" />
              {priorityDot(task.priority)}
              {statusIcon(task.status)}
              <span className="truncate">{task.title}</span>
            </div>
          ))}
          {dayTasks.length > 3 && (
            <span className="text-[10px] text-muted-foreground pl-1">+{dayTasks.length - 3} more</span>
          )}
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];
  const upcomingTasks = tasks
    .filter(t => t.dueDate >= today && t.status !== "completed")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 8);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="text-lg">{monthName}</CardTitle>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-2">💡 Drag and drop tasks between dates to reschedule</p>
            <div className="grid grid-cols-7 gap-1 mb-1">
              {weekDays.map(d => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">{days}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingTasks.length === 0 && (
              <p className="text-sm text-muted-foreground">No upcoming tasks</p>
            )}
            {upcomingTasks.map(task => (
              <div key={task.id} className="flex flex-col gap-1 p-2 rounded-lg border border-border bg-secondary/30">
                <div className="flex items-center gap-1.5">
                  {statusIcon(task.status)}
                  <span className="text-xs font-medium truncate">{task.title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">{getStaffName(task.assignedTo)}</span>
                  <div className="flex items-center gap-1">
                    <Badge variant={task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"} className="text-[10px] px-1 py-0">
                      {task.priority}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">{task.dueDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaskCalendar;
