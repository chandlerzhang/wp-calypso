/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import { getProductCategories } from '../selectors';

describe( 'selectors', () => {
	describe( '#getProductCategories()', () => {
		it( 'should return an empty array if data is not available.', () => {
			const state = {
				extensions: {
					woocommerce: {}
				}
			};

			expect( getProductCategories( state, 123 ) ).to.eql( [] );
		} );

		it( 'should give product categories from specified site', () => {
			const categories123 = [
				{ name: 'cat1' },
				{ name: 'cat2' },
			];

			const categories345 = [
				{ name: 'cat3' },
				{ name: 'cat4' },
			];

			const state = {
				extensions: {
					woocommerce: {
						wcApi: {
							[ 123 ]: {
								productCategories: categories123,
							},
							[ 345 ]: {
								productCategories: categories345,
							},
						}
					}
				}
			};

			expect( getProductCategories( state, 123 ) ).to.equal( categories123 );
			expect( getProductCategories( state, 345 ) ).to.equal( categories345 );
		} );
	} );
} );
