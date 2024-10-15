import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProjectState {
    projectDir: string;
    projects: any[];
    currentProjectFileNames: string[];
}

export const initialState: ProjectState = {
    projectDir: '',
    projects: [],
    currentProjectFileNames: [],
};

const ProjectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjectDir(state, action: PayloadAction<string>) {
        state.projectDir = action.payload;
    },
    setProjects(state, action: PayloadAction<any[]>) {
        state.projects = action.payload
    },
    setCurrentProjectFileNames(state, action: PayloadAction<string[]>) {
        state.currentProjectFileNames = action.payload;
    },
  },
});

export const {setProjectDir , setProjects, setCurrentProjectFileNames} = ProjectSlice.actions;
export default ProjectSlice.reducer;
