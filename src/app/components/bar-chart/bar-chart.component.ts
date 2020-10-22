import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserForm } from 'src/app/forms/user.form';
import { UserTypeEnum } from 'src/app/enums/user-type.enum';

@Component({
    selector: 'app-bar-chart-dialog',
    templateUrl: './bar-chart.component.html',
    styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {

    public doughnutChartLabels = [];
    public doughnutChartData = [];
    public doughnutChartType = 'doughnut';

    constructor(public dialogRef: MatDialogRef<BarChartComponent>,
                @Inject(MAT_DIALOG_DATA) public data: BarChartModel) {
    }

    ngOnInit(): void {
        this.prepareChartData();
    }

    prepareChartData(): void{
        Object.values(UserTypeEnum).forEach(
            type => {
                this.doughnutChartLabels.push(type);
                this.doughnutChartData.push(this.getOccurrence(type));
            }
        );
    }

    getOccurrence(value): number{
        let count = 0;
        this.data.users.forEach((v: UserForm) => (v.form.value.type === value && count++));
        return count;
    }


    onConfirm(): void {
        // Close the dialog, return true
        this.dialogRef.close(true);
    }

    onDismiss(): void {
        // Close the dialog, return false
        this.dialogRef.close(false);
    }
}

/**
 * Class to represent bar chart dialog model.
 *
 * It has been kept here to keep it as part of shared component.
 */
export class BarChartModel {
    constructor(public users: UserForm[]) {
    }
}
