import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

// Hooks & API
import { useTables, useTableStats, useCreateTable, useUpdateTable, useDeleteTable } from '../hooks';

// Components con (Modular)
import TableStats from '../components/TableStats';
import TableFilters from '../components/TableFilters';
import TableGrid from '../components/TableGrid';
import TableList from '../components/TableList';
import TableForm from '../components/TableForm';

// Shared UI Components
import Modal from '@/shared/ui/Modal';
import ConfirmDialog from '@/shared/ui/ConfirmDialog';

/**
 * OwnerTablesPage
 * Trang chủ điều phối toàn bộ phân hệ quản lý bàn. (Vietnamese comment)
 * Thiết kế giao diện sáng cao cấp với hiệu ứng Layering và Typography hiện đại. (Vietnamese comment)
 */
const OwnerTablesPage = () => {
  const { idOrSlug: restaurantId } = useParams();
  const { t } = useTranslation();

  // Trạng thái quản lý bộ lọc và chế độ hiển thị (Vietnamese comment)
  const [currentFloor, setCurrentFloor] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  
  // Trạng thái điều khiển các Modal và Dialog (Vietnamese comment)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [tableToDelete, setTableToDelete] = useState(null);

  // Fetch dữ liệu qua React Query (Vietnamese comment)
  // ✅ Dùng useMemo để tránh tạo object mới mỗi lần render → gây refetch vô hạn
  const tableParams = useMemo(() => ({
    location: currentFloor !== 'all' ? currentFloor : undefined
  }), [currentFloor]);

  const { data: tables, isLoading: isLoadingTables } = useTables(restaurantId, tableParams);
  
  const { data: stats, isLoading: isLoadingStats } = useTableStats(restaurantId);

  // Mutations xử lý dữ liệu (Vietnamese comment)
  const createMutation = useCreateTable(restaurantId);
  const updateMutation = useUpdateTable(restaurantId);
  const deleteMutation = useDeleteTable(restaurantId);

  // Logic lọc danh sách bàn phía Frontend (Vietnamese comment)
  const filteredTables = tables?.filter(table => 
    table.tableNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /**
   * Xử lý khi xác nhận gửi Form (Thêm/Sửa) (Vietnamese comment)
   */
  const handleFormSubmit = async (formData) => {
    try {
      // Chỉ gửi các trường cần thiết để đảm bảo tính tương thích với Schema Backend (Vietnamese comment)
      const payload = {
        tableNumber: formData.tableNumber,
        capacity: Number(formData.capacity),
        location: formData.location,
        type: formData.type,
        status: formData.status
      };

      if (editingTable) {
        // Hỗ trợ cả id và _id để đảm bảo mutation hoạt động chính xác (Vietnamese comment)
        const tableId = editingTable.id || editingTable._id;
        await updateMutation.mutateAsync({ tableId, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setIsFormOpen(false);
      setEditingTable(null);
    } catch (error) {
      // Lỗi được xử lý qua toast trong hook (Vietnamese comment)
    }
  };

  /**
   * Mở modal Sửa bàn (Vietnamese comment)
   */
  const handleEditClick = (table) => {
    setEditingTable(table);
    setIsFormOpen(true);
  };

  /**
   * Mở dialog Xác nhận xóa (Vietnamese comment)
   */
  const handleDeleteClick = (tableId) => {
    setTableToDelete(tableId);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (tableToDelete) {
      await deleteMutation.mutateAsync(tableToDelete);
      setIsDeleteConfirmOpen(false);
      setTableToDelete(null);
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-surface">
      {/* Page Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
            {t('tables.title', { defaultValue: 'Table Management' })}
          </h2>
          <p className="text-slate-500 font-bold text-lg">
            {t('tables.floor_overview', { defaultValue: 'Restaurant Floor Overview' })}
          </p>
        </div>
      </div>

      {/* 1. Thống kê nhanh (KPIs) - Refactored (Vietnamese comment) */}
      <TableStats stats={stats} isLoading={isLoadingStats} />

      {/* 2. Thanh điều hướng & Bộ lọc - Refactored (Vietnamese comment) */}
      <TableFilters
        currentFloor={currentFloor}
        onFloorChange={setCurrentFloor}
        onSearch={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddTable={() => {
          setEditingTable(null);
          setIsFormOpen(true);
        }}
      />

      {/* 3. Danh sách bàn: Grid hoặc List (Vietnamese comment) */}
      <div className="relative min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode + currentFloor}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            {viewMode === 'grid' ? (
              <TableGrid 
                tables={filteredTables} 
                onEdit={handleEditClick} 
                onDelete={handleDeleteClick}
                isLoading={isLoadingTables} 
              />
            ) : (
              <TableList 
                tables={filteredTables} 
                onEdit={handleEditClick} 
                onDelete={handleDeleteClick}
                isLoading={isLoadingTables} 
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modal Form: Thêm/Sửa bàn (Vietnamese comment) */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTable(null);
        }}
        title={editingTable ? t('tables.form.edit_title', { tableNumber: editingTable.tableNumber, defaultValue: `Refine Table: ${editingTable.tableNumber}` }) : t('tables.add_table', { defaultValue: 'Establish New Table' })}
        maxWidth="2xl"
      >
        <TableForm
          initialData={editingTable}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>

      {/* Dialog: Xác nhận xóa (Vietnamese comment) */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title={t('tables.form.delete_confirm_title', { defaultValue: 'Confirm Decommission' })}
        message={t('tables.form.delete_confirm_msg', { defaultValue: 'This action will permanently remove this table record. All historical associations will be archived. Are you sure you want to proceed?' })}
        type="danger"
        confirmText={t('tables.form.delete_confirm_btn', { defaultValue: 'Confirm Decommission' })}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default OwnerTablesPage;
