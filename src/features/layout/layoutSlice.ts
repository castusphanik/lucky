import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type TopBarConfig = {
    showBackButton: boolean;
    title: string;
    extraContent: React.ReactNode | null;
    isSideBarOpen: boolean,
    isBackClicked: boolean,
    showSearch: boolean,
};

const initialState: TopBarConfig = {
    showBackButton: false,
    title: 'Home',
    extraContent: null,
    isSideBarOpen: true,
    isBackClicked: false,
    showSearch: true
};

const layoutSlice = createSlice({
    name: 'layout',
    initialState,
    reducers: {
        // setTopBarConfig: (state, action: PayloadAction<TopBarConfig>) => {
        //     return action.payload;
        // },
        setTopBarConfig: (state, action: PayloadAction<Partial<TopBarConfig>>) => {
            return { ...state, ...action.payload };
        },
        setTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload;
        },
        setSideBarOpen: (state, action: PayloadAction<boolean>) => {
            state.isSideBarOpen = action.payload;
        },
        toggleSideBar: (state) => {
            state.isSideBarOpen = !state.isSideBarOpen;
        },
        resetTopbar: () => initialState,
    },
});

export const { setTopBarConfig, setTitle, setSideBarOpen, toggleSideBar } = layoutSlice.actions;
export default layoutSlice.reducer;
