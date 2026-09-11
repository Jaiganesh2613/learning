package com.example.crudapp.crud.repository;

import com.example.crudapp.crud.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository< Employee, Long > {
}
