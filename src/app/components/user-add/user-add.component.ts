import { Component, OnInit, Inject, EventEmitter, Optional, ChangeDetectionStrategy } from '@angular/core';
import { UserTypeEnum } from '../../enums/user-type.enum';
import { UserForm } from 'src/app/forms/user.form';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/models/user.model';
@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class UsersAddComponent implements OnInit {
  types: string[];
  userForm: UserForm;
  usersList: User[];
  emailAlreadyExist = false;

  constructor(fb: FormBuilder,
              public dialogRef: MatDialogRef<UsersAddComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
              private usersService: UsersService,
              ) {
    this.userForm = new UserForm();
  }

  getUsersList(): void {
    this.usersService.getAll().subscribe(
      result => {
        this.usersList = result;
      }
    );
  }

  ngOnInit(): void {
    this.types = Object.values(UserTypeEnum);
    this.getUsersList();

    this.userForm.form.controls.email.valueChanges.subscribe(
      value => this.checkEmailExists(value)
    );
  }

  addUser(): void {
    console.log('add user clicked !');
    const user = {
      name: this.userForm.form.controls.name.value,
      email: this.userForm.form.controls.email.value,
      type: this.userForm.form.controls.type.value
    };

    // used to refresh users list in users-list component
    this.usersService.create(user).subscribe(
      result => {
        console.log('result', result);
        this.dialogRef.close(user);
      }
    );

  }

  checkEmailExists(value): void {
    this.usersList.find(e => e.email === value) === undefined ?
    this.emailAlreadyExist = false : this.emailAlreadyExist = true;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
