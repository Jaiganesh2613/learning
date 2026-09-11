package com.example.crudapp.crud.service;

import com.example.crudapp.crud.entity.Employee;
import com.example.crudapp.crud.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    private final EmployeeRepository repository;

    public EmployeeService (EmployeeRepository repository) {
        this.repository = repository;
    }

    //CREATE
    public Employee CreateEmployee (Employee employee){
        return repository.save(employee);
    }

    //READ ALL
    public List<Employee> getAllEmployees(){
        return repository.findAll();
    }

    //READ ONE
    public Optional<Employee> getEmployeeById(Long id){
        return repository.findById(id);
    }

    //UPDATE
    public Employee updateEmployee (Long id, Employee employee) {
        Employee existingEmployee = repository.findById(id).orElseThrow(()-> new RuntimeException("Employee not found"));
        existingEmployee.setName(employee.getName());
        existingEmployee.setEmail(employee.getEmail());
        existingEmployee.setDepartment(employee.getDepartment());

        return repository.save(existingEmployee);
    }

    //DELETE
    public void deleteEmployeeId (Long id){
        if (!repository.existsById(id)){
            throw new RuntimeException("Employee not found");
        }
         repository.deleteById(id);
    }
}
