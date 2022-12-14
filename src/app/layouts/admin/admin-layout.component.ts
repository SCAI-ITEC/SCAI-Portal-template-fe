import { Component, OnInit, OnDestroy, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

declare const $: any;

@Component({
  selector: 'app-layout',
  templateUrl: './admin-layout.component.html'
})

export class AdminLayoutComponent implements OnInit, AfterViewInit {
    private _router: Subscription;
    private lastPoppedUrl: string;
    private yScrollStack: number[] = [];
    url: string;
    location: Location;

    @ViewChild('sidebar', {static: false}) sidebar: any;
    @ViewChild(NavbarComponent, {static: false}) navbar: NavbarComponent;
    constructor( private router: Router, location: Location ) {
      this.location = location;
    }
    ngOnInit() {
        const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
        const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
        this.location.subscribe((ev:PopStateEvent) => {
            this.lastPoppedUrl = ev.url;
        });
         this.router.events.subscribe((event:any) => {
            if (event instanceof NavigationStart) {
               if (event.url != this.lastPoppedUrl)
                   this.yScrollStack.push(window.scrollY);
           } else if (event instanceof NavigationEnd) {
               if (event.url == this.lastPoppedUrl) {
                   this.lastPoppedUrl = undefined;
                   window.scrollTo(0, this.yScrollStack.pop());
               }
               else
                   window.scrollTo(0, 0);
           }
        });
        this._router = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
             elemMainPanel.scrollTop = 0;
             elemSidebar.scrollTop = 0;
        });
        const html = document.getElementsByTagName('html')[0];
        // if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
        //     let ps = new PerfectScrollbar(elemMainPanel);
        //     ps = new PerfectScrollbar(elemSidebar);
        //     html.classList.add('perfect-scrollbar-on');
        // }
        // else {
        //     html.classList.add('perfect-scrollbar-off');
        // }
        this._router = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
          this.navbar.sidebarClose();
        });
    }
    ngAfterViewInit() {
        this.runOnRouteChange();
    }
    runOnRouteChange(): void {
      // if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      //   const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
      //   const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
      //   let ps = new PerfectScrollbar(elemMainPanel);
      //   ps = new PerfectScrollbar(elemSidebar);
      //   ps.update();
      // }
    }
    isMac(): boolean {
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    }
}
