import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        Cafecitos by
        <a href="https://devcito.org" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">Devcito</a>
    </div>`
})
export class AppFooter {}
