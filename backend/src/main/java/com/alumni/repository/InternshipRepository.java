package com.alumni.repository;

import com.alumni.entity.Internship;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InternshipRepository extends JpaRepository<Internship, Long> {
	List<Internship> findByOwnerIdOrderByIdDesc(Long ownerId);
}
