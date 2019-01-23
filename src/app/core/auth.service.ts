import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

interface User {
  uid: string;
  email?: string;
  photoURL?: string;
  displayName?: string;
  catchPhrase?: string;
  emailVerified?: boolean;
  phoneNumber?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  user: Observable<User>;

  get windowRef() {
    return window
  }

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
    ) {
      this.user = this.afAuth.authState.pipe(switchMap(user => {
        if(user){
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
        }else{
          return of(null);
        }
      }))
     }

     googleLogin() {
      const provider = new auth.GoogleAuthProvider()
      return this.oAuthLogin(provider);
    }

    private oAuthLogin(provider) {
      return this.afAuth.auth.signInWithPopup(provider)
        .then((credential) => {
          this.updateUserData(credential.user)
        })
    }

    private updateUserData(user) {
      // Sets user data to firestore on login
      const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    
      const data: User = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }
    
      return userRef.set(data, { merge: true })
    }

    signOut() {
      this.afAuth.auth.signOut().then(() => {
          this.router.navigate(['/']);
      });
    }
////////////////////////////////////////////////////////////////////////////////////////////////
    emailSignUp(email: string, password: string) {
      return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        .then(user => {
          return this.setUserDoc(user.user) // create initial user document
        })
        .catch(error => {this.handleError(error)});
    }
  
    emailLogin(email: string, password: string) {
      return this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .then(user => {
          return this.setUserDoc(user.user)
        })
        .catch(error => {this.handleError(error) });
    }
    // Update properties on the user document
    updateUser(user: User, data: any) { 
      return this.afs.doc(`users/${user.uid}`).update(data)
    }
    // If error, console log and notify user
    private handleError(error) {
      console.error(error)
    }

    private setUserDoc(user) {

      const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
  
      const data: User = {
        uid: user.uid,
        email: user.email || null,
        photoURL: 'https://git-scm.com/images/logos/downloads/Git-Icon-Black.png',
        phoneNumber: user.phoneNumber || null
      }
  
      return userRef.set(data, { merge: true })
    }
    ////////////////////////////////////////////////////////////////////////////////////
    phoneLogin(phoneNumber: string, appVerifier: firebase.auth.ApplicationVerifier) {
      return this.afAuth.auth.signInWithPhoneNumber(phoneNumber,appVerifier)
        .then(verifyLoginCode => {
          return verifyLoginCode;
        })
        .catch(error => {this.handleError(error)});
    }
    phoneLoginAddUser(user){
      return this.setUserDoc(user);
    }

}









