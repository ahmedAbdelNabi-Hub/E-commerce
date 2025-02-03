import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, delay, Observable, of } from 'rxjs';
import * as CryptoJS from 'crypto-js'
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class RegistrationService {

    private tokenKey = 'flv';
    private dataKey = 'registrationData'; // Key for storing form data
    private updatedateKey = 'updatedate'; // Key for storing the updatedate (step data)
    private containtIsChange: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([
        'Create a Breezo Account',  // Initial Title
        'Enter your Name'           // Initial Subtitle
    ]);
    private _http = inject(HttpClient);
    private isLoadingSubject = new BehaviorSubject<boolean>(false);
    isLoading$ = this.isLoadingSubject.asObservable();
    containtIsChange$: Observable<string[]> = this.containtIsChange.asObservable();
    private readonly secretkey = 'a6b0542a57ba28b563a3af5bc1c2c453a29bc3e8bf5f25c8fb0389f8d7aebe5e';
    constructor(private router: Router) { }

    updateContent(newContent: string[]): void {
        this.containtIsChange.next(newContent);
    }

    getContent(): string[] {
        return this.containtIsChange.getValue();
    }

    clearContent() {
        this.containtIsChange.next(['', '']);
    }

    setDefContent(): void {
        this.containtIsChange.next(['Create a Breezo Account', 'Enter your Name']);
    }

    generateStrongRandomToken(): string {
        const array = new Uint8Array(32); // Generates a 20-byte random value
        window.crypto.getRandomValues(array); // Fill the array with cryptographically secure random values
        return Array.from(array).map(byte => byte.toString(16).padStart(2, '0')).join(''); // Convert to hex string
    }

    // Store the generated token in sessionStorage
    storeToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }

    getEmail(): string {
        const registerDate = this.getRegisterFormData();
        const email = registerDate[0]['email'];
        return email;
    }

    // Retrieve the token from sessionStorage
    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    // Validate the token passed from the query param
    validateTokenFromQueryParam(route: ActivatedRoute): boolean {
        const tokenFromQuery = this.getTokenFromQuery(route);
        const tokenFromSession = this.getToken();
        if (!tokenFromQuery || tokenFromQuery !== tokenFromSession) {
            return false;
        }
        console.log(true);
        return true;
    }

    updateFormData(stepData: any): void {
        const currentData = this.getRegisterFormData();
        const updateDate = { ...currentData[0], ...stepData };
        const listIsContain: any[] = [];
        listIsContain.push(updateDate)
        console.log(updateDate)
        console.log(listIsContain)
        const encryptedUpdateDate = CryptoJS.AES.encrypt(JSON.stringify(listIsContain), this.secretkey).toString();
        localStorage.setItem(this.updatedateKey, encryptedUpdateDate);
    }
    register(url:string): Observable<any> {
        return this._http.post('https://localhost:7197/api/Authentication/register',{...this.getRegisterFormData()[0],url:url});
    }
    confirmEmail(token:string): Observable<any> {
        return this._http.post('https://localhost:7197/api/Authentication/ConfirmEmail',{email:this.getEmail(),token:token});
    }



    clearFormData(): void {
        localStorage.removeItem(this.updatedateKey);
    }

    clearToken(): void {
        localStorage.removeItem(this.dataKey);
    }

    getRegisterFormData(): any[] {
        const encryptedUpdateDate = localStorage.getItem(this.updatedateKey);
        if (encryptedUpdateDate) {
            const bytes = CryptoJS.AES.decrypt(encryptedUpdateDate, this.secretkey);
            const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
            return decryptedData ? JSON.parse(decryptedData) : [];
        }
        return [];
    }

    getTokenFromQuery(route: ActivatedRoute): string | null {
        return route.snapshot.queryParamMap.get('flv');
    }

    validateTokenAndProceed(route: ActivatedRoute, requiredLength: number): boolean {
        const isValid = this.validateTokenFromQueryParam(route);
        if (isValid !== true) {
            this.clearFormData();
        }
        const updatedate = this.getRegisterFormData();
        const numberOfKeys = Object.keys(updatedate[0]).length;
        console.log(updatedate);
        if (numberOfKeys === requiredLength && isValid) {
            return true;
        }
        return false;
    }

    simulateDelay(): Observable<void> {
        return of(undefined).pipe(delay(800));
    }

    setLoadingState(isLoading: boolean) {
        this.isLoadingSubject.next(isLoading);
    }
}
