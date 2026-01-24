"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Info, AlertTriangle, XCircle, X } from 'lucide-react';
import { Notification, NotificationType } from '@/lib/stores/notificationStore';

interface NotificationToastProps {
    notification: Notification;
    onClose: () => void;
}

const iconMap: Record<NotificationType, React.ReactNode> = {
    success: <CheckCircle size={20} className="text-green-500" />,
    info: <Info size={20} className="text-blue-500" />,
    warning: <AlertTriangle size={20} className="text-yellow-500" />,
    error: <XCircle size={20} className="text-red-500" />,
};

const colorMap: Record<NotificationType, string> = {
    success: 'border-green-500/30 bg-green-500/10',
    info: 'border-blue-500/30 bg-blue-500/10',
    warning: 'border-yellow-500/30 bg-yellow-500/10',
    error: 'border-red-500/30 bg-red-500/10',
};

export const NotificationToast: React.FC<NotificationToastProps> = ({
    notification,
    onClose,
}) => {
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const duration = notification.duration || 4000;
        const interval = 50;
        const decrement = (interval / duration) * 100;

        const timer = setInterval(() => {
            setProgress((prev) => {
                const next = prev - decrement;
                if (next <= 0) {
                    clearInterval(timer);
                    return 0;
                }
                return next;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [notification.duration]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className={`relative w-80 glass border rounded-2xl p-4 shadow-xl ${colorMap[notification.type]
                }`}
        >
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">{iconMap[notification.type]}</div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white leading-relaxed">
                        {notification.message}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="flex-shrink-0 text-muted hover:text-white transition-colors"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 rounded-b-2xl overflow-hidden">
                <motion.div
                    className="h-full bg-primary"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.05, ease: 'linear' }}
                />
            </div>
        </motion.div>
    );
};
