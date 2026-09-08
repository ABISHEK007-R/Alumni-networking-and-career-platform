package com.alumni.repository;
import com.alumni.entity.Referral;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ReferralRepository extends JpaRepository<Referral, Long> {
 List<Referral> findByAlumniIdOrStudentIdOrderByCreatedAtDesc(Long alumniId, Long studentId);
 long countByStudentIdOrAlumniId(Long studentId, Long alumniId);
}
