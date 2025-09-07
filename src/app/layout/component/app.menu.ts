import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Principal',
                items: [{ label: 'Mis Ordenes', icon: 'pi pi-fw pi-book', routerLink: ['/'] }]
            },
            {
                label: 'Administracion',
                items: [
                    { label: 'Productos', icon: 'pi pi-fw pi-box', routerLink: ['/products'] },
                    { label: 'Usuarios', icon: 'pi pi-fw pi-user', routerLink: ['/users'] }
                ]
            },
            {
                label: 'Ordenes',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/orders'],
                items: [
                    {
                        label: 'Pendientes',
                        icon: 'pi pi-fw pi-pen-to-square',
                        routerLink: ['/pending']
                    },
                    {
                        label: 'Historico',
                        icon: 'pi pi-fw pi-clock',
                        routerLink: ['/history']
                    },
                ]
            },
            {
                label: 'Procesado',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/statuses'],
                items: [
                    {
                        label: 'Comisionado',
                        icon: 'pi pi-fw pi-dollar',
                        routerLink: ['/orders']
                    },
                    {
                        label: 'Procesado',
                        icon: 'pi pi-fw pi-check-circle',
                        routerLink: ['/history']
                    },
                ]
            },
            {
                label: 'Reportes',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/orders'],
                items: [
                    {
                        label: 'Historico',
                        icon: 'pi pi-fw pi-clock',
                        routerLink: ['/reportes']
                    },

                ]
            },
        ];
    }
}
