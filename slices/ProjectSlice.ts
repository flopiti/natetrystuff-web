import { Project } from '@/types/project';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProjectState {
    projectDir: string;
    projects: Project[];
    currentProjectFileNames: string[];
    currentProject: Project | null;
}

export const initialState: ProjectState = {
    projectDir: '',
    projects: [],
    currentProjectFileNames: [],
    currentProject: null,
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
    setCurrentProject(state, action: PayloadAction<Project|null>) {
        state.currentProject = action.payload;
    }
  },
});

export const {setProjectDir , setProjects, setCurrentProjectFileNames, setCurrentProject} = ProjectSlice.actions;
export default ProjectSlice.reducer;
