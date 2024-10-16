// FileViewer.stories.tsx
import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { RootState } from '@/store';
import FileViewer from '@/components/FileViewer';
import { configureStore } from '@reduxjs/toolkit';

// Dummy reducer for the store
const reducer = (state = { Messages: { loading: false } }, action: any) => state;
const store = configureStore({ reducer: { Messages: (state = { loading: false }) => state } });

export default {
  title: 'Components/FileViewer',
  component: FileViewer,
  decorators: [(Story) => <Provider store={store}><Story /></Provider>],
} as Meta<typeof FileViewer>;

const Template: StoryFn<typeof FileViewer> = (args:any) => <FileViewer {...args} />;

export const Default = Template.bind({});
Default.args = {
  activeTab: 'file',
  setActiveTab: (tab: string) => console.log('Active Tab:', tab),
  selectedFileContent: 'Line 1\nLine 2\nLine 3',
  selectedChatCode: null,
  selectedFileName: 'example.txt',
  replaceCode: () => Promise.resolve(),
  setSelectedChatCode: (code: string) => console.log('Selected Chat Code:', code),
};

export const LoadingState = Template.bind({});
LoadingState.args = {
  ...Default.args,
  activeTab: 'chat',
  selectedChatCode: 'Chat code\nLine 1\nLine 2',
};

export const WithErrorMessage = Template.bind({});
WithErrorMessage.args = {
  ...Default.args,
  selectedChatCode: 'Chat code\nLine 1\nLine 2',
  replaceCode: () => Promise.reject(new Error('Failed to replace code.')),
};

export const WithSuccessMessage = Template.bind({});
WithSuccessMessage.args = {
  ...Default.args,
  activeTab: 'chat',
  selectedChatCode: 'Chat code\nLine 1\nLine 2',
  replaceCode: () => Promise.resolve(),
};
