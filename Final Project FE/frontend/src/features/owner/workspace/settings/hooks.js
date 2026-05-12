import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRestaurant, updateDepositPolicy } from './api';

export const useUpdateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ restaurantId, updateData }) => updateRestaurant(restaurantId, updateData),
    onSuccess: (_, variables) => {
      // Invalidate query "workspace" restaurant (đây là query key ở WorkspaceDashboard Layout/Hooks)
      queryClient.invalidateQueries(['workspace', 'restaurant', variables.restaurantId]);
    },
  });
};

export const useUpdateDepositPolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ restaurantId, policyData }) => updateDepositPolicy(restaurantId, policyData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['workspace', 'restaurant', variables.restaurantId]);
    },
  });
};
