import { Injectable } from '@angular/core';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class I18n {
    language = 'es';
}

@Injectable()
export class CustomCalendarI18nService extends NgbDatepickerI18n {

    public I18N_SPANISH = {
        weekdays: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
        months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    };
    constructor(private _i18n: I18n) {
        super();
    }

    getWeekdayLabel(weekday: number): string {
        return this.I18N_SPANISH.weekdays[weekday - 1];
    }
    getMonthShortName(month: number): string {
        return this.I18N_SPANISH.months[month - 1];
    }
    getMonthFullName(month: number): string {
        return this.getMonthShortName(month);
    }

    getDayAriaLabel(date: NgbDateStruct): string {
        return `${date.day}-${date.month}-${date.year}`;
    }
}