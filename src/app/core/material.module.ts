
import { NgModule } from '@angular/core';
import {MatButtonModule, MatCheckboxModule, MatInputModule } from '@angular/material';
import {MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

@NgModule({

    imports: [MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, BrowserAnimationsModule],
    exports: [MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, BrowserAnimationsModule],

})
export class MaterialModule{ }