/**
 * External dependencies
 */
import { expect } from 'chai';
import sinon from 'sinon';

/**
 * Internal dependencies
 */
import {
	PREFERENCES_RECEIVE,
	PREFERENCES_FETCH,
	PREFERENCES_FETCH_FAILURE,
	PREFERENCES_FETCH_SUCCESS,
	PREFERENCES_SET,
	PREFERENCES_SAVE,
	PREFERENCES_SAVE_FAILURE,
	PREFERENCES_SAVE_SUCCESS
} from 'state/action-types';
import { useSandbox } from 'test/helpers/use-sinon';
import { DEFAULT_PREFERENCES, USER_SETTING_KEY } from '../constants';
import { receivePreferences, fetchPreferences, savePreference, setPreference } from '../actions';
import useNock from 'test/helpers/use-nock';

describe( 'actions', () => {
	let sandbox, spy;

	useSandbox( newSandbox => {
		sandbox = newSandbox;
		spy = sandbox.spy();
	} );
	const responseShape = {
		[ USER_SETTING_KEY ]: DEFAULT_PREFERENCES
	};

	describe( 'receivePreferences()', () => {
		it( 'should return an action object', () => {
			const action = receivePreferences( { foo: 'bar' } );

			expect( action ).to.eql( {
				type: PREFERENCES_RECEIVE,
				values: {
					foo: 'bar'
				}
			} );
		} );
	} );

	describe( 'fetchPreferences()', () => {
		useNock( ( nock ) => {
			nock( 'https://public-api.wordpress.com:443' )
				.persist()
				.get( '/rest/v1.1/me/settings' )
				.reply( 200, responseShape );
		} );

		it( 'should dispatch fetch action when thunk triggered', () => {
			fetchPreferences()( spy );
			expect( spy ).to.have.been.calledWith( {
				type: PREFERENCES_FETCH
			} );
		} );

		it( 'should dispatch success action when request completes', () => {
			return fetchPreferences()( spy ).then( () => {
				expect( spy ).to.have.been.calledWithMatch( {
					type: PREFERENCES_FETCH_SUCCESS,
					values: responseShape[ USER_SETTING_KEY ],
				} );
			} );
		} );
	} );

	describe( 'fetchPreferences()', () => {
		useNock( ( nock ) => {
			nock( 'https://public-api.wordpress.com:443' )
				.persist()
				.get( '/rest/v1.1/me/settings' )
				.reply( 404 );
		} );

		it( 'should dispatch fail action when request fails', () => {
			return fetchPreferences()( spy ).then( () => {
				expect( spy ).to.have.been.calledWithMatch( {
					type: PREFERENCES_FETCH_FAILURE
				} );
			} );
		} );
	} );

	describe( 'setPreference()', () => {
		it( 'should return PREFERENCES_SET with correct payload', () => {
			expect( setPreference( 'preferenceKey', 'preferenceValue' ) ).to.deep.equal( {
				type: PREFERENCES_SET,
				key: 'preferenceKey',
				value: 'preferenceValue'
			} );
		} );
	} );

	describe( 'savePreference()', () => {
		useNock( ( nock ) => {
			nock( 'https://public-api.wordpress.com:443' )
				.persist()
				.post( '/rest/v1.1/me/settings/', {
					[ USER_SETTING_KEY ]: { preferenceKey: 'preferenceValue' }
				} )
				.reply( 200, responseShape );

			nock( 'https://public-api.wordpress.com:443' )
				.persist()
				.post( '/rest/v1.1/me/settings/', {
					[ USER_SETTING_KEY ]: { loggedOut: true }
				} )
				.reply( 403, {
					error: 'authorization_required',
					message: 'An active access token must be used to query information about the current user.'
				} );
		} );

		it( 'should dispatch PREFERENCES_SET action when thunk triggered', () => {
			savePreference( 'preferenceKey', 'preferenceValue' )( spy );
			expect( spy ).to.have.been.calledWithMatch( {
				type: PREFERENCES_SET,
				key: 'preferenceKey',
				value: 'preferenceValue'
			} );
		} );

		it( 'should dispatch PREFERENCES_SAVE action when thunk triggered', () => {
			savePreference( 'preferenceKey', 'preferenceValue' )( spy );
			expect( spy ).to.have.been.calledWithMatch( {
				type: PREFERENCES_SAVE,
				key: 'preferenceKey',
				value: 'preferenceValue'
			} );
		} );

		it( 'should dispatch PREFERENCES_RECEIVE action when request completes', () => {
			return savePreference( 'preferenceKey', 'preferenceValue' )( spy ).then( () => {
				expect( spy ).to.have.been.calledWithMatch( {
					type: PREFERENCES_RECEIVE,
					values: responseShape[ USER_SETTING_KEY ]
				} );
			} );
		} );

		it( 'should dispatch PREFERENCES_SAVE_FAILURE action when request fails', () => {
			return savePreference( 'loggedOut', true )( spy ).then( () => {
				expect( spy ).to.have.been.calledWithMatch( {
					type: PREFERENCES_SAVE_FAILURE,
					error: sinon.match( {
						message: 'An active access token must be used to query information about the current user.'
					} )
				} );
			} );
		} );

		it( 'should dispatch PREFERENCES_SAVE_SUCCESS action when request completes', () => {
			return savePreference( 'preferenceKey', 'preferenceValue' )( spy ).then( () => {
				expect( spy ).to.have.been.calledWithMatch( {
					type: PREFERENCES_SAVE_SUCCESS,
					key: 'preferenceKey',
					value: 'preferenceValue'
				} );
			} );
		} );
	} );
} );
