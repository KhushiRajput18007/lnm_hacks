"use client";

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNotificationStore } from '@/lib/stores/notificationStore';
import { NotificationToast } from './NotificationToast';

export const NotificationContainer: React.FC = () => {
    const { notifications, removeNotification } = useNotificationStore();

    return (
        <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
            <AnimatePresence>
                {notifications.map((notification) => (
                    <div key={notification.id} className="pointer-events-auto">
                        <NotificationToast
                            notification={notification}
                            onClose={() => removeNotification(notification.id)}
                        />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
};
