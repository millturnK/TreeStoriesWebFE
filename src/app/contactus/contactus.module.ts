/**
 * Created by evan on 16/09/2016.
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ContactUsComponent } from "./contactus.component";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [ContactUsComponent],
  exports: [ContactUsComponent]
})

export class ContactUsModule { }
