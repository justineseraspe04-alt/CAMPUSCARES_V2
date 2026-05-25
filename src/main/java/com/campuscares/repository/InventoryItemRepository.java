package com.campuscares.repository;

import com.campuscares.enums.ItemCategory;
import com.campuscares.model.InventoryItem;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
    List<InventoryItem> findByItemNameContainingIgnoreCase(String itemName);

    @Query("""
            SELECT i FROM InventoryItem i
            WHERE LOWER(i.itemName) = LOWER(:itemName)
            ORDER BY i.quantityAvailable DESC
            """)
    List<InventoryItem> findByItemNameIgnoreCaseOrderByQuantityAvailableDesc(@Param("itemName") String itemName);

    List<InventoryItem> findByCategory(ItemCategory category);

    List<InventoryItem> findByQuantityAvailableLessThanEqual(Integer quantityAvailable);

    List<InventoryItem> findByQuantityAvailableGreaterThan(Integer quantityAvailable);

    List<InventoryItem> findByCategoryAndQuantityAvailableGreaterThan(ItemCategory category, Integer quantity);

    List<InventoryItem> findByQuantityAvailableGreaterThanOrderByQuantityAvailableDesc(Integer quantityAvailable);

    @Query("""
            SELECT i FROM InventoryItem i
            WHERE LOWER(i.itemName) = LOWER(:itemName)
              AND i.category = :category
              AND i.itemCondition = :itemCondition
              AND COALESCE(i.size, '') = COALESCE(:size, '')
              AND COALESCE(i.subjectOrCourse, '') = COALESCE(:subjectOrCourse, '')
            """)
    Optional<InventoryItem> findMatchingItem(
            @Param("itemName") String itemName,
            @Param("category") ItemCategory category,
            @Param("itemCondition") String itemCondition,
            @Param("size") String size,
            @Param("subjectOrCourse") String subjectOrCourse);
}
