import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProjectState {
    projectDir: string;
}

export const initialState: ProjectState = {
    projectDir: '',
};

const ProjectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjectDir(state, action: PayloadAction<string>) {
        state.projectDir = action.payload;
    },

  },
});

export const {setProjectDir } = ProjectSlice.actions;
export default ProjectSlice.reducer;
