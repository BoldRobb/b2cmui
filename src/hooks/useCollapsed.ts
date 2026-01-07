import { useState, useEffect, useCallback } from 'react';

type UseCollapsedReturn = {
    collapsed: boolean;
    toggleCollapsed: () => void;
};

const DEFAULT_KEY = 'b2c_sider_collapsed';

function readStored(key: string, fallback: boolean) {
    if (typeof window === 'undefined') return fallback;
    try {
        const raw = localStorage.getItem(key);
        if (raw === null) return fallback;
        return raw === '1' || raw === 'true';
    } catch {
        return fallback;
    }
}

export default function useCollapsed(initial = true, storageKey = DEFAULT_KEY): UseCollapsedReturn {
    const [collapsed, setCollapsedState] = useState<boolean>(() => readStored(storageKey, initial));

    useEffect(() => {
            localStorage.setItem(storageKey, collapsed ? '1' : '0');
    }, [storageKey, collapsed]);


    const toggleCollapsed = useCallback(() => {
        setCollapsedState(prev => !prev);
    }, []);

    return { collapsed, toggleCollapsed };
}