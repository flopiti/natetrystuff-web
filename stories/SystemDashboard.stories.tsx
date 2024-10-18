import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Provider } from 'react-redux';
import SystemDashboard from '@/components/SystemDashboard';
import { configureStore } from '@reduxjs/toolkit';

const reducer = (state = { Files: { list: [] } }, action: any) => state;
const store = configureStore({ reducer: { Files: (state = { list: [] }) => state } });

export default {
  title: 'Components/SystemDashboard',
  component: SystemDashboard,
  decorators: [(Story) => <Provider store={store}><Story /></Provider>],
} as Meta<typeof SystemDashboard>;

// Define a Story template
const Template: StoryFn<typeof SystemDashboard> = (args: any) => <SystemDashboard {...args} />;

// Export default story
export const Default = Template.bind({});
Default.args = {
  // Mock props values for SystemDashboard component
};
