// // FileViewer.test.tsx
// import React from 'react';
// import { render, fireEvent, screen } from '@testing-library/react';
// import { Provider } from 'react-redux';
// import configureStore from 'redux-mock-store';
// import { RootState } from '@/store';

// const mockStore = configureStore<RootState>([]);
// const initialState = {
//   Messages: { loading: false },
// };
// const store = mockStore(initialState);

// describe('FileViewer Component', () => {
//   const mockSetActiveTab = jest.fn();
//   const mockReplaceCode = jest.fn().mockResolvedValue(undefined);
//   const mockSetSelectedChatCode = jest.fn();

//   const props = {
//     activeTab: 'chat',
//     setActiveTab: mockSetActiveTab,
//     selectedFileContent: 'Initial file content',
//     selectedChatCode: 'Initial chat code',
//     selectedFileName: 'TestFile.js',
//     replaceCode: mockReplaceCode,
//     setSelectedChatCode: mockSetSelectedChatCode,
//   };

//   const renderComponent = () =>
//     render(
//       <Provider store={store}>
//         <FileViewer {...props} />
//       </Provider>
//     );

//   test('renders Replace button and handles add action', () => {
//     renderComponent();

//     // Assuming there's at least one Add button rendered
//     const addButton = screen.getByText(/Add code/i);
//     expect(addButton).toBeInTheDocument();

//     fireEvent.click(addButton);

//     // Verify that setSelectedChatCode is called with updated code
//     expect(mockSetSelectedChatCode).toHaveBeenCalled();
//   });

//   test('handles remove action correctly', () => {
//     renderComponent();

//     // Assuming there's at least one Remove button rendered
//     const removeButton = screen.getByText(/Remove code/i);
//     expect(removeButton).toBeInTheDocument();

//     fireEvent.click(removeButton);

//     // Verify that setSelectedChatCode is called with updated code
//     expect(mockSetSelectedChatCode).toHaveBeenCalled();
//   });

//   test('handles Replace Code button click', async () => {
//     renderComponent();

//     const replaceButton = screen.getByText(/Replace code in TestFile.js/i);
//     expect(replaceButton).toBeInTheDocument();

//     fireEvent.click(replaceButton);

//     expect(mockReplaceCode).toHaveBeenCalled();
//     // Optionally, wait for success message
//     const successMessage = await screen.findByText(/Code replacement was successful./i);
//     expect(successMessage).toBeInTheDocument();
//   });
// });
