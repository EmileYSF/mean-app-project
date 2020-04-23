import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthentificated = false;
  private authStatusSubscription: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authStatusSubscription = this.authService.getAuthStatusListener().subscribe(isAuthentificated => {
      this.userIsAuthentificated = isAuthentificated;
    });
  }

  onLogout(): void {
    this.authService.logoutUser();
  }

  ngOnDestroy(): void {
    this.authStatusSubscription.unsubscribe();
  }
}
