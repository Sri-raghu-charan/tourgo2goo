import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell, MapPin, Trophy, Gift, Star, Check } from "lucide-react";

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: "nearby",
    title: "New place nearby!",
    message: "Crystal Falls is just 2.3 km away",
    time: "5 min ago",
    unread: true,
  },
  {
    id: 2,
    type: "challenge",
    title: "Challenge ending soon",
    message: "Weekend Explorer ends in 2 days",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    type: "reward",
    title: "New reward available",
    message: "20% off at Serenity Spa",
    time: "3 hours ago",
    unread: true,
  },
  {
    id: 4,
    type: "achievement",
    title: "Achievement unlocked!",
    message: "You earned the Explorer badge",
    time: "Yesterday",
    unread: false,
  },
];

interface NotificationsDropdownProps {
  children: React.ReactNode;
}

export function NotificationsDropdown({ children }: NotificationsDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  
  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, unread: false } : n
    ));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "nearby":
        return <MapPin className="w-4 h-4 text-primary" />;
      case "challenge":
        return <Trophy className="w-4 h-4 text-accent" />;
      case "reward":
        return <Gift className="w-4 h-4 text-coral" />;
      case "achievement":
        return <Star className="w-4 h-4 text-teal" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span className="font-display font-bold">Notifications</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-auto py-1 px-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                markAllAsRead();
              }}
            >
              <Check className="w-3 h-3 mr-1" />
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.map((notification) => (
          <DropdownMenuItem 
            key={notification.id} 
            className="flex items-start gap-3 p-3 cursor-pointer"
            onClick={() => markAsRead(notification.id)}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              notification.type === "nearby" ? "bg-primary/10" :
              notification.type === "challenge" ? "bg-accent/20" :
              notification.type === "reward" ? "bg-coral/10" :
              "bg-teal/10"
            }`}>
              {getIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={`font-semibold text-sm truncate ${
                  notification.unread ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {notification.title}
                </p>
                {notification.unread && (
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {notification.message}
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                {notification.time}
              </p>
            </div>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center justify-center text-sm text-primary font-medium">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
