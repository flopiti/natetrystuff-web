import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProjectState {
    projectDir: string;
    projects: any[];
}

export const initialState: ProjectState = {
    projectDir: '',
    projects: [],
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
    }
  },
});

export const {setProjectDir , setProjects} = ProjectSlice.actions;
export default ProjectSlice.reducer;
