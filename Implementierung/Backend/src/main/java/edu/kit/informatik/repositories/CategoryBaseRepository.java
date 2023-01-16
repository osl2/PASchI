package edu.kit.informatik.repositories;

import edu.kit.informatik.dto.interactions.CategoryDto;
import edu.kit.informatik.model.userdata.interactions.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryBaseRepository extends JpaRepository<Category, CategoryDto> {
}
