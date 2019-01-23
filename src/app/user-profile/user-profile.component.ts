import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { auth } from 'firebase/app';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  signupForm: FormGroup;
  signinForm: FormGroup;
  detailForm: FormGroup;

  phoneSigninForm: FormGroup;
  verificationCodeForm: FormGroup;

  windowRef: any;

  constructor(
    public auth: AuthService,
    public fb: FormBuilder) { }

  ngOnInit() {

    this.signupForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email
      ]
      ],
      'password': ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25),
        Validators.required
      ]
      ]
    });

    this.signinForm = this.fb.group({
      'email': ['', [Validators.required]],
      'password': ['', [Validators.required]]
    });

    this.detailForm = this.fb.group({
      'catchPhrase': ['', [Validators.required]]
    });

    this.phoneSigninForm = this.fb.group({
      'country': ['', [
        Validators.maxLength(3),
        Validators.required
      ]
      ],
      'area': ['', [
        Validators.maxLength(3),
        Validators.required
      ]
      ],
      'prefix': ['', [
        Validators.maxLength(3),
        Validators.required
      ]
      ],
      'line': ['', [
        Validators.maxLength(4),
        Validators.required
      ]
      ]
    });

    this.verificationCodeForm = this.fb.group({
      'verificationCode': ['', [Validators.required]]
    });

    this.windowRef = this.auth.windowRef
    this.windowRef.recaptchaVerifier = new auth.RecaptchaVerifier('recaptcha-container')

    this.windowRef.recaptchaVerifier.render().then(widgetId => {
      this.windowRef.recaptchaWidgetId = widgetId
    })
  }

  // Using getters will make your code look pretty
  get email() { return this.signupForm.get('email') }
  get password() { return this.signupForm.get('password') }

  get emailin() { return this.signinForm.get('email') }
  get passwordin() { return this.signinForm.get('password') }

  get catchPhrase() { return this.detailForm.get('catchPhrase') }

  signup() {
    return this.auth.emailSignUp(this.email.value, this.password.value)
  }
  signin() {
    return this.auth.emailLogin(this.emailin.value, this.passwordin.value)
  }

  setCatchPhrase(user) {
    return this.auth.updateUser(user, { catchPhrase: this.catchPhrase.value })
  }
  /////////////////////////////////////////////////////////
  get country() { return this.phoneSigninForm.get('country') }
  get area() { return this.phoneSigninForm.get('area') }
  get prefix() { return this.phoneSigninForm.get('prefix') }
  get line() { return this.phoneSigninForm.get('line') }

  get verificationCode() { return this.verificationCodeForm.get('verificationCode') }

  sendLoginCode() {
    const appVerifier = this.windowRef.recaptchaVerifier;
    const preNumber = this.country.value + this.area.value + this.prefix.value + this.line.value
    const num = `+${preNumber}`;

    this.auth.phoneLogin(num, appVerifier)
      .then(result => {
        this.windowRef.confirmationResult = result;
      })
      .catch(error => console.log(error));
  }

  verifyLoginCode() {
    this.windowRef.confirmationResult
      .confirm(this.verificationCode.value)
      .then(result => {
        return this.auth.phoneLoginAddUser(result.user)
      })
      .catch(error => console.log(error, "Incorrect code entered?"));
  }
}
