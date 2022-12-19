import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Item } from '../../../../core/shared/item.model';
import { getItemPageRoute } from '../../../item-page-routing-paths';
import { RouteService } from '../../../../core/services/route.service';
import { Observable } from 'rxjs';
import { getDSpaceQuery, isIiifEnabled, isIiifSearchEnabled } from './item-iiif-utils';
import { filter, map, take } from 'rxjs/operators';

@Component({
  selector: 'ds-item',
  template: ''
})
/**
 * A generic component for displaying metadata and relations of an item
 */
export class ItemComponent implements OnInit {
  @Input() object: Item;

  /**
   * Route to the item page
   */
  itemPageRoute: string;

  /**
   * Enables the mirador component.
   */
  iiifEnabled: boolean;

  /**
   * Used to configure search in mirador.
   */
  iiifSearchEnabled: boolean;

  /**
   * The query term from the previous dspace search.
   */
  iiifQuery$: Observable<string>;

  /**
   * Used to configure search in mirador.
   */
  showBackButton: Observable<boolean>;

  mediaViewer;

  constructor(protected routeService: RouteService) {
    this.mediaViewer = environment.mediaViewer;
  }
  ngOnInit(): void {
    this.itemPageRoute = getItemPageRoute(this.object);
    // check to see if iiif viewer is required.
    this.iiifEnabled = isIiifEnabled(this.object);
    this.iiifSearchEnabled = isIiifSearchEnabled(this.object);
    if (this.iiifSearchEnabled) {
      this.iiifQuery$ = getDSpaceQuery(this.object, this.routeService);
    }
    // Show the back to results button when the previous context was search, browse,
    // or recent submissions pagination.
    this.showBackButton = this.routeService.getPreviousUrl().pipe(
      filter(url => /^(\/search|\/browse|\/collections)/.test(url)),
      take(1),
      map(() => true)
    );
  }
}
