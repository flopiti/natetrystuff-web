import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Provider } from 'react-redux';
import FileViewer from '@/components/FileViewer';
import { configureStore } from '@reduxjs/toolkit';

const reducer = (state = { Messages: { loading: false } }, action: any) => state;
const store = configureStore({ reducer: { Messages: (state = { loading: false }) => state } });

export default {
  title: 'Components/FileViewer',
  component: FileViewer,
  decorators: [(Story) => <Provider store={store}><Story /></Provider>],
} as Meta<typeof FileViewer>;

const Template: StoryFn<typeof FileViewer> = (args: any) => {
    const [selectedChatCode, setSelectedChatCode] = useState(args.selectedChatCode);
  
    return (
      <FileViewer
        {...args}
        selectedChatCode={selectedChatCode}
        setSelectedChatCode={setSelectedChatCode}
      />
    );
  };
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

export const replaceText = Template.bind({});
replaceText.args = {
  ...Default.args,
  activeTab: 'chat',
  selectedChatCode: 'Chat code\nLine 1\nLine 2\n',
};

export const replaceText2 = Template.bind({});
replaceText2.args = {
  ...Default.args,
  selectedFileContent: 'LineChicken\nLine 1\nLine 2\nLine 3\nLine 4',

  activeTab: 'chat',
  selectedChatCode: 'Chat code\nandChat\nLine 1\nLine 2\nLine 4\nLine 5',
};