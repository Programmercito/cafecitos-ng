import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem, ConfirmationService, MessageService } from 'primeng/api';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { Logo } from "@/libs/components/logo/logo";
import { MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { UsersApiService } from 'src/app/users/services/users-api';
import { Menu } from 'primeng/menu';
import { Tooltip } from "primeng/tooltip";
import { Common } from '@/libs/components/Common';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, Logo, MenuModule, ConfirmDialogModule, ToastModule, Tooltip],
    providers: [MessageService, ConfirmationService, UsersApiService],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()" [pTooltip]="this.getCurrentUser().username+' '+this.getCurrentUser().type">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
                <app-logo></app-logo>
                <span>CAFECITO</span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
                <div class="relative">
                    <button
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <app-configurator />
                </div>
            </div>

                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action" (click)="toggleMenu($event)" >
                        <i class="pi pi-user"></i>
                        <span>Usuario</span>
                    </button>
                    <p-menu #menu [model]="menuItems" [popup]="true"></p-menu>
                </div>
        </div>
        <p-toast></p-toast>
        <p-confirmDialog></p-confirmDialog>
    </div>`
})
export class AppTopbar extends Common implements OnInit {
    items!: MenuItem[];
    menuItems: MenuItem[] = [];

    @ViewChild('menu') menu: Menu | undefined;

    constructor(public layoutService: LayoutService,
        private usersService: UsersApiService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router) {
        super();
    }

    ngOnInit(): void {
        this.menuItems = [
            { label: 'Change Password', icon: 'pi pi-fw pi-key', routerLink: '/change-password' },
            { label: 'Logout', icon: 'pi pi-fw pi-sign-out', command: () => this.logout() }
        ];
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    toggleMenu(event: Event) {
        this.menu?.toggle(event);
    }

    logout() {
        sessionStorage.removeItem('user');
        this.confirmationService.confirm({
            message: 'Are you sure you want to log out?',
            header: 'Confirm Logout',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.usersService.logout().subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Logged out successfully' });
                        this.router.navigate(['/auth/login']);
                    },
                    error: (err) => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Logout failed' });
                    }
                });
            }
        });

    }
}