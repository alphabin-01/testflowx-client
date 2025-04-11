'use client';

import { Toaster, ToasterProps } from 'sonner';
import { useTheme } from 'next-themes';

export function ToastProvider({
    position = 'top-right',
    duration = 4000,
    ...props
}: Partial<ToasterProps>) {
    const { theme } = useTheme();

    return (
        <Toaster
            theme={theme === 'dark' ? 'dark' : 'light'}
            position={position}
            duration={duration}
            closeButton
            richColors
            {...props}
        />
    );
}

export default ToastProvider; 