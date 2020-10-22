import { FormGroup, Validators, FormControl } from '@angular/forms';

export class UserForm {

    form = new FormGroup({
        id: new FormControl(),
        name: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        type: new FormControl(Validators.required),
        is_edit: new FormControl()
    });

    constructor() {

    }
}
