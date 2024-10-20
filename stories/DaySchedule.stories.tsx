import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import DaySchedule from '@/components/DaySchedule';

export default {
  title: 'Components/DaySchedule',
  component: DaySchedule,
} as Meta<typeof DaySchedule>;

const Template: StoryFn<typeof DaySchedule> = (args) => <div style={{ height: '70vh' }}><DaySchedule {...args} /></div>;

export const Default = Template.bind({});
Default.args = {
  day: new Date(),
  meals: [],
  mealsSchedule: [],
  addMealToSchedule: () => {},
  deleteScheduledMeal: () => {},
  day_: {},
  setDays: () => {},
  days: [],
  setMealsSchedule: () => {},
  setDayInOffice: () => {},
  setDayRemote: () => {},
};