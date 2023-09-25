import { Component } from '@angular/core';
import { Employee } from './employee.model';
import { EmployeeRestService } from '../services/employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent {
  empObject: Employee = new Employee();

  employees : Array<Employee> =  new Array<Employee>();

  constructor(private employeeRestService : EmployeeRestService) {
    this.loadEmployees();
  }
  
  clear(){
    this.empObject = new Employee();
  }
  
  loadEmployees() {
    return this.employeeRestService.getEmployees().subscribe((data: Employee[]) => {
      
      this.employees = new Array<Employee>();
      for(let item of data){
        let employee : Employee = new Employee();
        employee.id = item.id;
        employee.first_name = item.first_name;
        employee.last_name = item.last_name;
        employee.contact = item.contact;
        employee.email = item.email;
        employee.dob = item.dob;
        employee.address = item.address;
        this.employees.push(employee)
      }    
      this.clear();
    });
  }

  select(selectedEmployees: Employee) {
    this.empObject = Object.assign({}, selectedEmployees)
  }


  submit() {
    var employeedto : any = {};
    employeedto.first_name = this.empObject.first_name;
    employeedto.last_name = this.empObject.last_name;
    employeedto.contact = this.empObject.contact;
    employeedto.email = this.empObject.email;
    employeedto.dob = this.empObject.dob;
    employeedto.address = this.empObject.address;

    this.employeeRestService.createEmployees(employeedto).subscribe((data: {}) => {
      window.alert("Data Inserted Successfully!!!")
    });
    this.loadEmployees();
  }

  delete() {
    let id = this.empObject.id;
    this.employeeRestService.deleteEmployees(id).subscribe((data: {}) => {
      window.alert("Data Deleted Successfully!!!")
    });
    this.loadEmployees();
  }

//   delete(id: number) {
//     this.employeeRestService.deleteEmployees(id).subscribe((data: {}) => {
//         window.alert("Data Deleted Successfully!!!");
//         this.loadEmployees();
//     });
// }


  update(){
    var employeedto: any = {};
    employeedto.id = this.empObject.id;
    employeedto.first_name = this.empObject.first_name;
    employeedto.last_name = this.empObject.last_name;
    employeedto.contact = this.empObject.contact;
    employeedto.email = this.empObject.email;
    employeedto.dob = this.empObject.dob;
    employeedto.address = this.empObject.address;


    this.employeeRestService.updateEmployees(employeedto.id, employeedto).subscribe((data: {}) => {
      window.alert("Data Updated Successfully!!!")
    });
    this.loadEmployees();
  }


  hasError(typeofvalidator: string, controlname: string) : boolean 
  {
    return this.empObject
    .formCustomerGroup
    .controls[controlname]
    .hasError(typeofvalidator)
  }
}
