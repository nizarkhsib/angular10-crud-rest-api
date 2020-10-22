import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class SearchForm {

    form: FormGroup;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            filter: [''],
        });
    }
}
