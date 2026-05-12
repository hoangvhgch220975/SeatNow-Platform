import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { queryClient } from '../lib/queryClient.js';

/**
 * @file providers.jsx
 * @description Tập hợp các Provider toàn cục (React Query, Toast, Auth...)
 */
export const AppProviders = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
