import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useMenu } from '../hooks';
import MenuHeader from '../components/MenuHeader';
import MenuFilters from '../components/MenuFilters';
import MenuGrid from '../components/MenuGrid';
import MenuTable from '../components/MenuTable';
import MenuItemModal from '../components/MenuItemModal';
import MenuItemDetailModal from '../components/MenuItemDetailModal';
import Pagination from '@/shared/ui/Pagination';
import { useDisclosure } from '@/shared/hooks/useDisclosure';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import ConfirmDialog from '@/shared/ui/ConfirmDialog';

/**
 * Trang Quản lý Thực đơn của Chủ nhà hàng
 * Container chính để quản lý tất cả các món ăn của nhà hàng
 * Điều phối các bộ lọc nâng cao (Tìm kiếm, Danh mục, Trạng thái, Sắp xếp) và các thao tác CRUD
 */
const OwnerMenuPage = () => {
  const { idOrSlug: restaurantId } = useParams();
  const { t } = useTranslation();
  
  // Trạng thái bộ lọc cấp cao đồng bộ với Query Params của BE
  // Giới hạn mặc định là 9 (cho chế độ hiển thị lưới)
  const [filters, setFilters] = useState({ 
    category: '', 
    status: '', 
    sortBy: 'name_asc',
    search: '',
    limit: 9,
    offset: 0
  });

  // Trạng thái cục bộ cho giá trị tìm kiếm để phản hồi tức thì trước khi debounce
  const [searchValue, setSearchValue] = useState('');
  
  // Trạng thái quản lý món ăn (Thêm/Sửa/Xem)
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  
  // Điều khiển Modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isDetailOpen, 
    onOpen: onOpenDetail, 
    onClose: onCloseDetail 
  } = useDisclosure();

  // Điều khiển Dialog xác nhận xóa (Vietnamese comment)
  const { 
    isOpen: isDeleteOpen, 
    onOpen: onOpenDelete, 
    onClose: onCloseDelete 
  } = useDisclosure();
  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Logic Debounce: Cập nhật bộ lọc tìm kiếm sau 500ms không hoạt động
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchValue, offset: 0 }));
    }, 500);

    return () => clearTimeout(handler);
  }, [searchValue]);

  // Quản lý chế độ hiển thị (Lưới vs Bảng)
  const [viewMode, setViewMode] = useState('grid');

  // Xử lý điều chỉnh giới hạn và reset offset khi thay đổi chế độ hiển thị
  useEffect(() => {
    const newLimit = viewMode === 'grid' ? 9 : 10;
    setFilters(prev => ({ ...prev, limit: newLimit, offset: 0 }));
  }, [viewMode]);
  
  // Hook lấy dữ liệu menu sử dụng các bộ lọc mở rộng
  const { 
    menuItems, 
    total,
    isLoading, 
    createItem, 
    isCreating, 
    updateItem, 
    isUpdating, 
    deleteItem 
  } = useMenu(restaurantId, filters);

  // Tính toán tổng số trang
  const totalPages = Math.ceil((total || 0) / filters.limit);
  const currentPage = Math.floor(filters.offset / filters.limit) + 1;

  // Tính toán số lượng theo trạng thái và danh mục (từ dữ liệu đã tải)
  const counts = useMemo(() => {
    const statusCounts = {
      all: total || 0,
      available: menuItems.filter(i => i.isAvailable).length,
      unavailable: menuItems.filter(i => !i.isAvailable).length
    };

    const categoryCounts = menuItems.reduce((acc, item) => {
      const cat = item.category;
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, { all: total || 0 });

    return { status: statusCounts, category: categoryCounts };
  }, [menuItems, total]);

  /**
   * Các hàm xử lý hành động
   */
  const handlePageChange = (page) => {
    const newOffset = (page - 1) * filters.limit;
    setFilters(prev => ({ ...prev, offset: newOffset }));
    // Cuộn mượt lên đầu danh sách
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleAddClick = () => {
    setEditingItem(null);
    onOpen();
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    onOpen();
  };

  const handleViewClick = (item) => {
    setViewingItem(item);
    onOpenDetail();
  };

  const handleDeleteClick = (itemId) => {
    // Lưu ID và mở dialog xác nhận (Vietnamese comment)
    setItemIdToDelete(itemId);
    onOpenDelete();
  };

  const handleConfirmDelete = async () => {
    if (!itemIdToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteItem(itemIdToDelete);
      onCloseDelete();
      setItemIdToDelete(null);
    } catch (error) {
      // Lỗi đã được xử lý trong toast của hook tùy chỉnh (Vietnamese comment)
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingItem) {
        await updateItem({ itemId: editingItem._id, data });
      } else {
        await createItem(data);
      }
      onClose();
    } catch (error) {
      // Lỗi đã được xử lý trong toast của hook tùy chỉnh
    }
  };

  /**
   * Các hàm đồng bộ cập nhật bộ lọc
   */
  const handleCategoryChange = (category) => {
    setFilters(prev => ({ ...prev, category, offset: 0 }));
  };

  const handleStatusChange = (status) => {
    setFilters(prev => ({ ...prev, status, offset: 0 }));
  };

  const handleSortByChange = (sortBy) => {
    setFilters(prev => ({ ...prev, sortBy, offset: 0 }));
  };

  return (
    <div className="max-w-(--breakpoint-2xl) mx-auto pt-6 md:pt-10 lg:pt-12 pb-20 space-y-12 animate-in fade-in duration-1000 -mt-10">
      {/* Header động với nút thêm món mới */}
      <MenuHeader onAddItem={handleAddClick} />
      
      {/* Lớp bộ lọc nâng cao: Tìm kiếm, Tabs, Selects & Chuyển đổi chế độ hiển thị */}
      <MenuFilters 
        selectedCategory={filters.category}
        onCategoryChange={handleCategoryChange}
        selectedStatus={filters.status}
        onStatusChange={handleStatusChange}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        sortBy={filters.sortBy}
        onSortByChange={handleSortByChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        counts={counts}
      />

      {/* Hiển thị danh sách món ăn dưới dạng Lưới hoặc Bảng */}
      <div className="min-h-[600px]">
        {viewMode === 'grid' ? (
          <MenuGrid 
            items={menuItems}
            isLoading={isLoading}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onView={handleViewClick}
          />
        ) : (
          <MenuTable 
            items={menuItems}
            isLoading={isLoading}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onView={handleViewClick}
          />
        )}
      </div>

      {/* Điều khiển phân trang */}
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Modal Thêm/Sửa món ăn */}
      <MenuItemModal 
        isOpen={isOpen}
        onClose={onClose}
        initialData={editingItem}
        onSubmit={handleFormSubmit}
        isSubmitting={isCreating || isUpdating}
      />

      {/* Modal Xem chi tiết món ăn (Bộ sưu tập ảnh Carousel) */}
      <MenuItemDetailModal 
        isOpen={isDetailOpen}
        onClose={onCloseDetail}
        item={viewingItem}
      />

      {/* Dialog xác nhận xóa món ăn (Vietnamese comment) */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={onCloseDelete}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title={t('common.delete')}
        message={t('menu_mgmt.confirm_delete')}
        confirmText={t('common.delete')}
        type="danger"
      />
    </div>
  );
};

export default OwnerMenuPage;
