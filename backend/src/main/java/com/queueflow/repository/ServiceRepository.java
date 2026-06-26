package com.queueflow.repository;

import com.queueflow.entity.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceRepository extends JpaRepository<ServiceEntity, Long> {
    Optional<ServiceEntity> findByServiceName(String serviceName);
    List<ServiceEntity> findByIndustry(String industry);
    List<ServiceEntity> findByIndustryAndIsActiveTrue(String industry);
}
