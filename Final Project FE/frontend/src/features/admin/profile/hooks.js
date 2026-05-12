import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminProfileApi } from './api.js';

/**
 * @file hooks.js
 * @description Dedicated React Query hooks for Admin Profile.
 * Follows the "Code English, Comment Vietnamese" rule.
 */

/**
 * @hook useAdminProfile
 * @description Fetch current admin profile data.
 */
export const useAdminProfile = () => {
    return useQuery({
        queryKey: ['admin', 'profile', 'me'],
        queryFn: async () => {
            const response = await adminProfileApi.getMe();
            // Axios returns body in .data. Backend returns User in .data.data
            return response.data?.data || response.data || response;
        },
        staleTime: 5 * 60 * 1000,
    });
};

/**
 * @hook useUpdateAdminProfile
 * @description Mutation to update admin profile (limited to allowed fields in FE).
 */
export const useUpdateAdminProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => adminProfileApi.updateMe(data),
        onSuccess: () => {
            // Invalidate both admin and general profile queries to keep UI in sync
            // (Vietnamese: Làm mới cả cache admin và profile chung để giao diện đồng bộ)
            queryClient.invalidateQueries({ queryKey: ['admin', 'profile', 'me'] });
            queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
        }
    });
};
