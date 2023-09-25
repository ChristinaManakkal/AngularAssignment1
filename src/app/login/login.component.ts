import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EmployeeRestService } from '../services/employee.service';
import { forkJoin, switchMap } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})

export class LoginComponent {
  IsAuthenticationFailed: boolean = false;
  first_id: number;
  dob_id: number;

  loginForm = new FormGroup({
    UserName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    Password: new FormControl('', [Validators.required, Validators.minLength(3)])
  })

  constructor(private router: Router, private employeeRestService : EmployeeRestService) {
    this.IsAuthenticationFailed = false;
  }



  

  
  login() {
    const username = this.loginForm.controls.UserName.value;
    const password = this.loginForm.controls.Password.value;

    forkJoin([
      this.employeeRestService.getIdByName(username),
      this.employeeRestService.getIdByDateofBirth(password)
    ]).subscribe(([nameData, dobData]) => {
      const idByName = nameData?.[0]?.id;
      this.first_id = idByName;
      const idByDOB = dobData?.[0]?.id;
      this.dob_id = idByDOB;
      // data? check if data is null or undefined -> returns undefined 
      // [0]? check if array is empty or not an array -> returns undefined
      // .id if above conditions passed then it access the `id` property -> returns id


      if (typeof idByName === 'number' && typeof idByDOB === 'number' && idByName === idByDOB) {
        // IDs match, route to another page
        this.IsAuthenticationFailed = false;      // Goes to the Html file to display the error
        this.router.navigate(['welcome', idByDOB]);
      } else {
        // IDs don't match, display error
        this.IsAuthenticationFailed = true;       // Goes to the Html file to display the error
        // window.alert("Incorrect username or password");
      }
    }, error => {
      console.error("Error occurred while fetching data", error);
      this.IsAuthenticationFailed = true;
      window.alert("An error occurred while logging in. Please try again later.");
    }); 
  }
  
}
