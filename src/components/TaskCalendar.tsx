import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStaff } from "@/contexts/StaffContext";

const TaskCalendar = () => {
  const { tasks, staff } = useStaff();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getStaffName = (id: string) => staff.find(s => s.id === id)?.name || "Unassigned";

  const tasksByDate = useMemo(() => {
    const map: Record<string, typeof tasks> = {};
    tasks.forEach(task => {
      const key = task.dueDate;
      if (!map[key]) map[key] = [];
      map[key].push(task);
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

  const days = [];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Empty cells for days before the first day
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="min-h-[100px] bg-muted/30 rounded-lg" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayTasks = tasksByDate[dateStr] || [];
    const isToday = new Date().toISOString().split("T")[0] === dateStr;

    days.push(
      <div
        key={day}
        className={`min-h-[100px] rounded-lg border p-1.5 transition-smooth ${
          isToday ? "border-primary bg-primary/5" : "border-border bg-card"
        }`}
      >
        <div className={`text-xs font-semibold mb-1 ${isToday ? "text-primary" : "text-foreground"}`}>
          {day}
        </div>
        <div className="space-y-0.5">
          {dayTasks.slice(0, 3).map(task => (
            <div
              key={task.id}
              className="flex items-center gap-1 text-[10px] p-1 rounded bg-secondary/50 leading-tight"
            >
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

  // Today's & upcoming tasks sidebar
  const today = new Date().toISOString().split("T")[0];
  const upcomingTasks = tasks
    .filter(t => t.dueDate >= today && t.status !== "completed")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 8);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        {/* Calendar Grid */}
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
            <div className="grid grid-cols-7 gap-1 mb-1">
              {weekDays.map(d => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">{days}</div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
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
