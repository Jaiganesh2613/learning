package com.example.crudapp.crud.controller;

import com.example.crudapp.crud.entity.Employee;
import com.example.crudapp.crud.service.EmployeeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/employees")
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeeController {

    private EmployeeService service;

    public EmployeeController (EmployeeService service){
        this.service = service;
    }

    //CREATE
    @PostMapping
    public Employee createEmployee (@RequestBody Employee employee){
        return service.CreateEmployee(employee);
    }

    //READ ALL
    @GetMapping
    public List<Employee> getAllEmployees() {
        return service.getAllEmployees();
    }

    //READ ONE
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id){
        return service.getEmployeeById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    //UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee (@PathVariable Long id, @RequestBody Employee employee) {
        try {
            return ResponseEntity.ok(service.updateEmployee(id, employee));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    //DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity <Void> deleteEmployee (@PathVariable Long id) {
        try{
            service.deleteEmployeeId(id);
            return ResponseEntity.noContent ().build();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
