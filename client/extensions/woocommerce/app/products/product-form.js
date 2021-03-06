/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';

/**
 * Internal dependencies
 */
import ProductFormDetailsCard from './product-form-details-card';
import ProductFormVariationsCard from './product-form-variations-card';

export default class ProductForm extends Component {

	static propTypes = {
		product: PropTypes.shape( {
			id: PropTypes.isRequired,
			type: PropTypes.string.isRequired,
			name: PropTypes.string,
		} ),
		editProduct: PropTypes.func.isRequired,
		editProductAttribute: PropTypes.func.isRequired,
	};

	render() {
		const { product } = this.props;
		return (
			<div className="woocommerce products__form">
				<ProductFormDetailsCard
					product={ product }
					editProduct={ this.props.editProduct }
				/>

				<ProductFormVariationsCard
					product={ product }
					editProduct={ this.props.editProduct }
					editProductAttribute={ this.props.editProductAttribute }
				/>
			</div>
		);
	}

}
