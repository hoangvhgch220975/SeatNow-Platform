import { useState, useCallback } from 'react';

/**
 * Handle state bật tắt Modals, Dialog, Slide Drawer, Tooltip Panel 
 */
export const useDisclosure = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  
  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);
  const onToggle = useCallback(() => setIsOpen((prev) => !prev), []);
  
  return { isOpen, onOpen, onClose, onToggle };
};
