import { Component } from '@angular/core';
import { NotificationsWidget } from './components/notificationswidget';
import { StatsWidget } from './components/statswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';
import { BestSellingWidget } from './components/bestsellingwidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';
import { Common } from '@/libs/components/Common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    template: `

    `
})
export class Dashboard extends Common {
    constructor(private route: Router) {
        super();
        if (!this.getCurrentUser().id) {
            this.route.navigate(['/auth/login']);
        }
    }
}
