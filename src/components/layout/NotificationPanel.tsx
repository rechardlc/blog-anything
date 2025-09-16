'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bell,
  X,
  MessageSquare,
  User,
  Settings,
  AlertCircle,
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'bug' | 'user' | 'comment' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  avatar?: string;
  priority?: 'high' | 'medium' | 'low';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'bug',
    title: 'Bug Report',
    message: 'You have a bug that needs to be fixed',
    time: '0:32 AM',
    read: false,
    priority: 'high',
  },
  {
    id: '2',
    type: 'user',
    title: 'New user registered',
    message: 'A new user has joined the platform',
    time: '1:23 AM',
    read: false,
    priority: 'medium',
  },
  {
    id: '3',
    type: 'bug',
    title: 'Critical Issue',
    message: 'You have a bug that needs to be addressed',
    time: '0:32 AM',
    read: true,
    priority: 'high',
  },
  {
    id: '4',
    type: 'comment',
    title: 'New Comment',
    message: 'Andi Lane subscribed to you',
    time: 'Yesterday 12:39 AM',
    read: true,
    priority: 'low',
  },
];

const activities = [
  {
    id: '1',
    user: 'Edited the details of Project X',
    email: 'Email@gmail.com',
    time: '1:32 AM',
    avatar: '/avatar.jpg',
  },
  {
    id: '2',
    user: 'ByeWind',
    email: '',
    time: '1:32 AM',
    avatar: '/avatar.jpg',
  },
  {
    id: '3',
    user: 'Submitted a bug',
    email: 'Yesterday 12:39 AM',
    time: 'Yesterday 12:39 AM',
    avatar: '/avatar.jpg',
  },
];

const contacts = [
  { name: 'Natali Craig', avatar: '/avatar.jpg' },
  { name: 'Drew Cano', avatar: '/avatar.jpg' },
  { name: 'Orlando Diggs', avatar: '/avatar.jpg' },
  { name: 'Andi Lane', avatar: '/avatar.jpg' },
  { name: 'Kate Morrison', avatar: '/avatar.jpg' },
  { name: 'Koray Okumus', avatar: '/avatar.jpg' },
];

function getNotificationIcon(type: string) {
  switch (type) {
    case 'bug':
      return <AlertCircle className='w-4 h-4' />;
    case 'user':
      return <User className='w-4 h-4' />;
    case 'comment':
      return <MessageSquare className='w-4 h-4' />;
    case 'system':
      return <Settings className='w-4 h-4' />;
    default:
      return <Bell className='w-4 h-4' />;
  }
}

function getPriorityColor(priority?: string) {
  switch (priority) {
    case 'high':
      return 'bg-red-500';
    case 'medium':
      return 'bg-amber-500';
    case 'low':
      return 'bg-emerald-500';
    default:
      return 'bg-blue-500';
  }
}

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className='w-80 h-full border-l border-border/60 bg-card/50 backdrop-blur-sm'>
      {/* Header */}
      <div className='p-6 border-b border-border/60'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-bold'>Notifications</h2>
          <Button variant='ghost' size='icon' className='h-8 w-8'>
            <X className='w-4 h-4' />
          </Button>
        </div>

        {unreadCount > 0 && (
          <Badge className='bg-red-500 text-white'>{unreadCount} new</Badge>
        )}
      </div>

      <ScrollArea className='h-full'>
        {/* Notifications */}
        <div className='p-4 space-y-3'>
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-4 rounded-2xl border transition-all duration-200 hover:shadow-md cursor-pointer ${
                notification.read
                  ? 'border-border/40 bg-background/50'
                  : 'border-border bg-background shadow-sm'
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className='flex items-start space-x-3'>
                <div
                  className={`p-2 rounded-xl ${getPriorityColor(notification.priority)} text-white`}
                >
                  {getNotificationIcon(notification.type)}
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-semibold text-foreground'>
                    {notification.title}
                  </p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    {notification.message}
                  </p>
                  <p className='text-xs text-muted-foreground mt-2'>
                    {notification.time}
                  </p>
                </div>
                {!notification.read && (
                  <div className='w-2 h-2 bg-primary rounded-full'></div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Activities */}
        <div className='p-4 border-t border-border/60'>
          <h3 className='text-sm font-bold mb-4'>Activities</h3>
          <div className='space-y-4'>
            {activities.map(activity => (
              <div key={activity.id} className='flex items-center space-x-3'>
                <Avatar className='h-8 w-8'>
                  <AvatarImage src={activity.avatar} />
                  <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className='flex-1 min-w-0'>
                  <p className='text-xs font-medium text-foreground'>
                    {activity.user}
                  </p>
                  {activity.email && (
                    <p className='text-xs text-muted-foreground'>
                      {activity.email}
                    </p>
                  )}
                  <p className='text-xs text-muted-foreground'>
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contacts */}
        <div className='p-4 border-t border-border/60'>
          <h3 className='text-sm font-bold mb-4'>Contacts</h3>
          <div className='space-y-3'>
            {contacts.map((contact, index) => (
              <div key={index} className='flex items-center space-x-3'>
                <Avatar className='h-8 w-8'>
                  <AvatarImage src={contact.avatar} />
                  <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className='text-sm font-medium'>{contact.name}</span>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
