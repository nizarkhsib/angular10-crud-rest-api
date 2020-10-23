import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UsersAddComponent } from '../user-add/user-add.component';
import { User } from 'src/app/models/user.model';
import { UsersService } from 'src/app/services/users.service';
import { SearchForm } from 'src/app/forms/search.form';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { fromEvent } from 'rxjs';
import { debounceTime, map, startWith, distinctUntilChanged } from 'rxjs/operators';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserTypeEnum } from 'src/app/enums/user-type.enum';
import { UserForm } from 'src/app/forms/user.form';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})

export class UsersListComponent implements OnInit, AfterViewInit {

  types: string[];

  title = 'Users list';

  displayedColumns: string[] = ['name', 'email', 'type', 'action'];

  dataSource = new MatTableDataSource<UserForm>();

  searchForm: SearchForm;

  userForm: UserForm;

  @ViewChild('searchInput') input: ElementRef;

  isAdminExist = false;

  activeEdit: any[] = [];

  users: UserForm[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public fb: FormBuilder,
              public dialog: MatDialog,
              private snackBar: MatSnackBar,
              public chartDialog: MatDialog,
              public deleteConfirmDialog: MatDialog,
              private usersService: UsersService) {
    this.searchForm = new SearchForm(fb);
  }

  ngOnInit(): void {
    this.getUserList();
    this.types = Object.values(UserTypeEnum);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    const terms$ = fromEvent<any>(this.input.nativeElement, 'keyup')
    .pipe(
      map(event => event.target.value),
      startWith(''),
      debounceTime(500),
      distinctUntilChanged()
    );

    terms$.subscribe(
          searchText => {
            this.dataSource.filter = searchText.trim().toLowerCase();
          });
  }

  setupFilter(column: string, column2: string): void {
    this.dataSource.filterPredicate = (d: UserForm, filter: string) => {
      const textToSearch = d.form.value[column] && d.form.value[column].toLowerCase() || '';
      const textToSearch2 = d.form.value[column2] && d.form.value[column2].toLowerCase() || '';
      return textToSearch.indexOf(filter) !== -1 || textToSearch2.indexOf(filter) !== -1;
    };
  }

  getUserList(): void {

    this.usersService.getAll().subscribe(
      (result: User[]) => {

        result.forEach(

          element => {
            const user = new UserForm();
            user.form.value.id = element.id;
            user.form.value.name = element.name;
            user.form.value.email = element.email;
            user.form.value.type = element.type;
            user.form.value.is_edit = false;
            this.users.push(user);
          }

        );

        result.find( e => e.type === 'Admin') === undefined ? this.isAdminExist = false : this.isAdminExist = true;
      }
    );

    this.dataSource.data = this.users;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(UsersAddComponent, {
      width: '500px',
      data: { admin: this.isAdminExist }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.snackBar.open('User created succesfuly !', 'Close', {
          duration: 2000,
        });
        // refresh the data source
        const newUser = new UserForm();
        newUser.form.patchValue(result);
        this.dataSource.data.push(newUser);
        this.dataSource.data = this.dataSource.data;
      }
    });
  }

  openChart(): void {
    const dialogRef = this.dialog.open(BarChartComponent, {
      width: '500px',
      data: { users: this.users }
    });
  }

  deleteUser(user): void {

    const message = 'Are you sure you want to do delete ' + user.form.value.name + ' ?';
    const dialogData = new ConfirmDialogModel('Confirm Action', message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        this.usersService.delete(user.form.value.id).subscribe(
          result => {

            this.snackBar.open('User ' + user.form.value.name + ' deleted successfuly', 'Close', {
              duration: 2000,
            });

            const index = this.users.indexOf(user, 0);
            if (index > -1) {
              this.users.splice(index, 1);
            }
            this.dataSource.data = this.dataSource.data;
          }
        );
      }
    });
  }

  edit(user): void {
    const userEdit = {
      id: user.form.value.id,
      name: user.form.value.name,
      email: user.form.value.email,
      type: user.form.value.type,
      is_edit: true
    };

    // set user to active edit list
    const clonedObj = Object.assign({}, user);
    this.activeEdit.push(userEdit);
    user.form.patchValue(userEdit);

  }

  cancelEdit(user): void {
    user.form.get('is_edit').setValue(false);
    const obj = this.activeEdit.find( e => e.id === user.form.value.id);

    const index = this.activeEdit.indexOf( obj, 0);

    if (index > -1) {
      this.activeEdit.splice(index, 1);
    }

    obj.is_edit = false;
    user.form.patchValue(obj);

  }

  validateEdit(user): void {
    user.form.get('is_edit').setValue(false);
    console.log('user', user.form.value);
    const userEdit = {
      id: user.form.value.id,
      name: user.form.value.name,
      email: user.form.value.email,
      type: user.form.value.type,
      is_edit: false
    };

    // Call update service
    this.usersService.update(user.form.value.id, userEdit).subscribe(
      result => {
        this.snackBar.open('User ' + result.name + ' updated succesfully', 'Close', {
          duration: 2000,
        });
      }
    );

  }

}


