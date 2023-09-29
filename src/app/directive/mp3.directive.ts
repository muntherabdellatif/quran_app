import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
	selector: '[mp3]'
})
export class Mp3Directive implements OnChanges {

	@Input('mp3') mp3: any;

	constructor(
		private renderer: Renderer2,
		private el: ElementRef,
	) { }

	ngOnChanges(): void {
		this.renderer.setProperty(this.el.nativeElement, 'src', this.mp3);
	}

}
