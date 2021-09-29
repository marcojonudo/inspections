import {
	ChangeDetectionStrategy,
	Component,
	ElementRef, EventEmitter, Inject,
	Input,
	OnDestroy, OnInit,
	Optional, Output, QueryList, Self,
	ViewChildren
} from '@angular/core';
import { MAT_FORM_FIELD, MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { AbstractControl, ControlValueAccessor, FormBuilder, FormGroup, NgControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { TextItemField } from '../../objects/inspections/items/text-item-field';
import { Constants } from '../../objects/constants';

export class SeparatorInputModel {

	constructor(public values: string[], public separator: string) {}

	findValue(): string {
		return this.values.join(this.separator);
	}

}

@Component({
	selector: 'app-separator-input',
	templateUrl: './separator-input.component.html',
	styleUrls: ['./separator-input.component.sass'],
	providers: [{ provide: MatFormFieldControl, useExisting: SeparatorInputComponent }],
	host: {
		'[class.separator-input-floating]': 'shouldLabelFloat',
		'[id]': 'id',
	},
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeparatorInputComponent
	implements ControlValueAccessor, MatFormFieldControl<SeparatorInputModel>, OnInit, OnDestroy {

	static nextId = 0;

	@ViewChildren('fieldInput') fieldInputs: QueryList<HTMLInputElement>;

	@Input() fields: TextItemField[];
	@Input() separator: string;
	@Input() model: SeparatorInputModel;
	@Output() valueEmitter: EventEmitter<SeparatorInputModel>;

	values: string[];

	private _placeholder: string;

	@Input() get placeholder(): string {
		return this._placeholder;
	}

	set placeholder(value: string) {
		this._placeholder = value;
		this.stateChanges.next();
	}

	private _required = false;

	@Input()
	get required(): boolean {
		return this._required;
	}

	set required(value: boolean) {
		this._required = coerceBooleanProperty(value);
		this.stateChanges.next();
	}

	private _disabled = false;

	@Input() get disabled(): boolean {
		return this._disabled;
	}

	set disabled(value: boolean) {
		this._disabled = coerceBooleanProperty(value);
		this._disabled ? this.parts.disable() : this.parts.enable();
		this.stateChanges.next();
	}

	parts: FormGroup;
	stateChanges = new Subject<void>();
	focused = false;
	touched = false;
	controlType = 'separator-input-element';
	id = `separator-input-element-${SeparatorInputComponent.nextId++}`;

	onChange = (_: any) => {
		this.valueEmitter.emit(this.value);
	}
	onTouched = () => {};

	get empty() {
		return !(Object.values(this.parts.controls).find(control => control.value) !== undefined);
	}

	get shouldLabelFloat() {
		return this.focused || !this.empty;
	}

	@Input()
	get value(): SeparatorInputModel | null {
		if (this.parts.valid) {
			const values = Object.values(this.parts.value).map(value => value) as string[];
			return new SeparatorInputModel(values, this.separator);
		}
		return null;
	}

	set value(value: SeparatorInputModel | null) {
		this.parts.setValue(new SeparatorInputModel([], this.separator));
		this.stateChanges.next();
	}

	get errorState(): boolean {
		return this.parts.invalid && this.touched;
	}

	constructor(
		private formBuilder: FormBuilder,
		private _focusMonitor: FocusMonitor,
		private _elementRef: ElementRef<HTMLElement>,
		@Optional() @Inject(MAT_FORM_FIELD) public _formField: MatFormField,
		@Optional() @Self() public ngControl: NgControl
	) {
		this.valueEmitter = new EventEmitter<SeparatorInputModel>();
		if (this.ngControl != null) {
			this.ngControl.valueAccessor = this;
		}
	}

	ngOnInit() {
		this.values = this.model ? this.model.values : this.fields.map(() => '');
		const controlsConfig = {};
		this.fields.forEach((field, i) => {
			controlsConfig[`field-${i}`] = [
				this.values[i], [Validators.required, Validators.maxLength(field.maxLength)]
			];
		});
		this.parts = this.formBuilder.group(controlsConfig);
	}

	ngOnDestroy() {
		this.stateChanges.complete();
		this._focusMonitor.stopMonitoring(this._elementRef);
	}

	onFocusIn() {
		if (!this.focused) {
			this.focused = true;
			this.stateChanges.next();
		}
	}

	onFocusOut(event: FocusEvent) {
		if (!this._elementRef.nativeElement.contains(event.relatedTarget as Element)) {
			this.touched = true;
			this.focused = false;
			this.onTouched();
			this.stateChanges.next();
		}
	}

	autoFocusNext(control: AbstractControl, field: TextItemField, nextElement?: HTMLInputElement): void {
		const filledInput = control.value.length === field.maxLength;
		if (filledInput && nextElement) {
			this._focusMonitor.focusVia(nextElement, 'program');
		}
	}

	autoFocusPrev(control: AbstractControl, prevElement: HTMLInputElement): void {
		if (control.value.length < 1) {
			this._focusMonitor.focusVia(prevElement, 'program');
		}
	}

	setDescribedByIds(ids: string[]) {
		const controlElement = this._elementRef.nativeElement
			.querySelector('.separator-input-container')!;
		controlElement.setAttribute('aria-describedby', ids.join(' '));
	}

	onContainerClick() {
		const controls = Object.values(this.parts.controls);
		const invalidIndex = controls.findIndex(control => !control.valid);
		const index = invalidIndex !== -1 ? invalidIndex : controls.length - 1;
		this._focusMonitor.focusVia(this.fieldInputs.toArray()[index], 'program');
	}

	writeValue(value: SeparatorInputModel | null): void {
		this.value = value;
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	handleInput(i: number): void {
		/* Si no es el último input, se evalúa si se debe enfocar el siguiente */
		if (i < this.fields.length - 1) {
			const nextElem = this.fieldInputs.toArray()[(i + 1) % this.fieldInputs.length];
			this.autoFocusNext(this.parts.controls[`field-${i}`], this.fields[i], nextElem);
		}
		if (this.value) {
			this.onChange(this.value);
		}
	}

	handleAutoFocusPrev(i: number): void {
		if (i > 0) {
			this.autoFocusPrev(this.parts.controls[`field-${i}`], this.fieldInputs.toArray()[i - 1]);
		}
	}

	findMaxLength(field: TextItemField): number {
		return field.maxLength || Constants.TEXT_ITEM_MAX_LENGTH;
	}

}
