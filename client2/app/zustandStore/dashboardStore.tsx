import {create} from 'zustand';

interface notificaitonCardHover {
    toggle : boolean;
    toggleOn : () => void;
    toggleOff : () => void;
}

export const useNotificationToggle = create<notificaitonCardHover>((set, get) => ({
    toggle: false,
    toggleOn: () => {
        set({ toggle: true });
    },
    toggleOff: () => {
        set({ toggle: false });
    },
}));