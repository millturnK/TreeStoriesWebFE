import { Component, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import {ContactService} from './services/contact.service';
import {Contact} from './models/contact';
import {AppConsts} from '../app.consts';

declare var jQuery: any;

function emailValidator(control: FormControl): { [s: string]: boolean } {

    const pattern =  /^(([^<>()[\]\\.,;:\s@\']+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //
    return control.value.match(pattern) ? null : {pattern: true};
}

@Component({
  selector: 'app-contact',
  providers: [ContactService],
  templateUrl: 'contactus.component.html',
  styleUrls: ['contactus.component.css']
})
export class ContactUsComponent {

  success = false;
  errorMessage: string;
  // used to control the spinny thing when waiting for a response
  loading = false;

  appConsts: AppConsts;

  // Just trying to bind to a model class - main reason is to allow better diagnostics
  // and hopefully sort out the problem where the input field doesn"t alway map to the
  // actual form value
  contact = new Contact('', '', '');


  // form controls & group needed to unpin this form
  name = new FormControl('', Validators.required);
  email = new FormControl('', Validators.compose([Validators.required, emailValidator]));
  message = new FormControl('', [Validators.required, Validators.maxLength(300)]);

  contactForm = new FormGroup({
    name: this.name,
    email: this.email,
    message: this.message
  });

  constructor(private elementRef: ElementRef, private contactService: ContactService, _appConsts: AppConsts) {
      this.appConsts = _appConsts;
  }

 private successfulSubmit() {

    this.loading = false;  // turn off the spinny thing
    this.success = true;

    // clear out the form controls
    this.name.reset('');
    this.email.reset('');
    this.message.reset('');

  }

  private failedSubmit(error: any) {
    this.loading = false;  // turn off the spinny thing
    this.success = false;
    this.errorMessage = error;

  }

  onSubmit(form: any): void {

    // clear out my result fields...
    this.success = false;
    this.errorMessage = '';

    // TODO Might need to double check this in safari as the autocomplete
    // doesn't work correctly with angular2
    const nameVal = jQuery(this.elementRef.nativeElement).find('#name').val();

    const contact = new Contact(this.contactForm.controls['name'].value,
                              this.contactForm.controls['email'].value,
                              this.contactForm.controls['message'].value);

    // toggle the loading flag
    this.loading = true;

    this.contactService.sendMsg( contact )
                          .subscribe( contactRet => this.successfulSubmit(),
                                      error => this.failedSubmit(<any>error));


  }

}
