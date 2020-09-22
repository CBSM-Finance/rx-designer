import { Component, OnInit, Input, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit, OnChanges } from '@angular/core';
import { Designer } from '../designer/designer';
import { DesignerNode, DesignerNodeInput } from '../nodes/designer-node';
import { fromEvent } from 'rxjs';
import { SubSink } from 'subsink';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-node-details',
  templateUrl: './node-details.component.html',
  styleUrls: ['./node-details.component.scss']
})
export class NodeDetailsComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('label', { read: ElementRef }) label: ElementRef<HTMLInputElement>;
  @Input() node: DesignerNode;
  @Input() designer: Designer;

  private subs = new SubSink();

  constructor(private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    this.setLabelValue();
  }

  ngAfterViewInit() {
    const label = this.label.nativeElement;
    this.setLabelValue();
    this.subs.sink = fromEvent(label, 'keyup').pipe(
      map(evt => (evt.target as HTMLInputElement).value),
      tap(value => {
        this.node.label = value;
        this.cdRef.detectChanges();
      })
    ).subscribe();
  }

  private setLabelValue() {
    if (!this.label) return void 0;
    const label = this.label.nativeElement;
    const value = this.node.label || '';
    label.value = value;
    if (value === '') label.focus();
  }

  removeNode() {
    this.designer.removeNode(this.node);
  }

  close() {
    this.designer.selectedNode = void 0;
  }
}
