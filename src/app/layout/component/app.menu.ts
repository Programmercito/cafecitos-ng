import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { Common } from '@/libs/components/Common';

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
export class AppMenu extends Common {

    model: MenuItem[] = [];

    ngOnInit() {
        const type = this.getCurrentUser().type;
        this.model = [
            {
                label: 'Principal',
                items: [{ label: 'Inicio', icon: 'pi pi-fw pi-book', routerLink: ['/'] }]
            },
            {
                label: 'Administracion',
                items: [
                    { label: 'Productos', icon: 'pi pi-fw pi-box', routerLink: ['/products'] },
                    { label: 'Usuarios', icon: 'pi pi-fw pi-user', routerLink: ['/users'] },
                ]
            },
            {
                label: 'Ordenes',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/orders'],
                items: [
                    {
                        label: 'Mis ordenes',
                        icon: 'pi pi-fw pi-pen-to-square',
                        routerLink: ['/orders/me']
                    },
                    {
                        label: 'Historico',
                        icon: 'pi pi-fw pi-clock',
                        routerLink: ['/orders/history']
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
                        routerLink: ['/orders/commissiong']
                    },
                    {
                        label: 'Procesando',
                        icon: 'pi pi-fw pi-check-circle',
                        routerLink: ['/orders/processing']
                    },
                    {
                        label: 'Procesado',
                        icon: 'pi pi-fw pi-check-circle',
                        routerLink: ['/orders/processed']
                    },
                ]
            }
        ];

        if (type !== 'ADMINISTRATOR') {
            this.model = this.model.filter(item => item.label === 'Ordenes');
        }
    }
}

