import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  userIsAuthentificated = false;
  private authStatusSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.authStatusSubscription = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthentificated) => {
        this.userIsAuthentificated = isAuthentificated;
      });
    if (!this.userIsAuthentificated) {
      this.router.navigate(['/login']);
    }
    return this.userIsAuthentificated;
  }
}
