/**
 * External dependencies
 */
import React from 'react';
import page from 'page';
import includes from 'lodash/includes';

/**
 * Internal dependencies
 */
import { renderWithReduxStore } from 'lib/react-helpers';
import AsyncLoad from 'components/async-load';
import StatsPagePlaceholder from 'my-sites/stats/stats-page-placeholder';

function isValidParameters( context ) {
	const validParameters = {
		type: [ 'orders', 'customers', 'stock' ],
		period: [ 'year', 'last_month', 'month', '7day', 'custom' ],
		segment: [ 'sales_by_date', 'sales_by_product', 'sales_by_category', 'coupon_usage' ]
	};
	return Object.keys( validParameters )
		.every( param => includes( validParameters[ param ], context.params[ param ] ) );
}

export default function StatsController( context ) {
	if ( ! isValidParameters( context ) ) {
		page.redirect( `/store/stats/7day/sales_by_date/${ context.params.site }` );
	}

	const props = {
		type: context.params.type,
		period: context.params.period,
		segment: context.params.segment,
		startDate: context.query.start_date,
		endDate: context.query.end_date,
	};
	renderWithReduxStore(
		<AsyncLoad
			/* eslint-disable wpcalypso/jsx-classname-namespace */
			placeholder={ <StatsPagePlaceholder className="woocommerce" /> }
			/* eslint-enable wpcalypso/jsx-classname-namespace */
			require="extensions/woocommerce/app/stats"
			{ ...props }
		/>,
		document.getElementById( 'primary' ),
		context.store
	);
}
