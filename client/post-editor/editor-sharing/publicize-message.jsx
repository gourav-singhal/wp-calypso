/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import CountedTextarea from 'components/forms/counted-textarea';
import FormTextarea from 'components/forms/form-textarea';
import InfoPopover from 'components/info-popover';
import TrackInputChanges from 'components/track-input-changes';
import PostActions from 'lib/posts/actions';
import stats from 'lib/posts/stats';

export default React.createClass( {
	displayName: 'PublicizeMessage',

	propTypes: {
		disabled: React.PropTypes.bool,
		message: React.PropTypes.string,
		preview: React.PropTypes.string,
		acceptableLength: React.PropTypes.number,
		requireCount: React.PropTypes.bool,
		onChange: React.PropTypes.func
	},

	getDefaultProps: function() {
		return {
			disabled: false,
			message: '',
			acceptableLength: 140,
			requireCount: false,
		};
	},

	onChange: function( event ) {
		// TODO: REDUX - remove flux actions when whole post-editor is reduxified
		if ( this.props.onChange ) {
			this.props.onChange( event.target.value );
		} else {
			PostActions.updateMetadata( '_wpas_mess', event.target.value );
		}
	},

	recordStats: function() {
		stats.recordStat( 'sharing_message_changed' );
		stats.recordEvent( 'Publicize Sharing Message Changed' );
	},

	renderInfoPopover: function() {
		return (
			<InfoPopover
				className="publicize-message-counter-info"
				position="bottom left"
				gaEventCategory="Editor"
				popoverName="SharingMessage"
			>
				{ this.translate(
					'The length includes space for the link to your post and an attached image.',
					{ context: 'Post editor sharing message counter explanation' }
			) }
			</InfoPopover>
		);
	},

	renderTextarea: function() {
		if ( this.props.requireCount ) {
			return (
				<CountedTextarea
					disabled={ this.props.disabled }
					value={ this.props.message }
					placeholder={ this.props.preview }
					countPlaceholderLength={ true }
					onChange={ this.onChange }
					showRemainingCharacters={ true }
					acceptableLength={ this.props.acceptableLength }
					className="editor-sharing__message-input"
				>
					{ this.renderInfoPopover() }
				</CountedTextarea>
			);
		} else {
			return (
				<FormTextarea
					disabled={ this.props.disabled }
					value={ this.props.message }
					placeholder={ this.props.preview }
					onChange={ this.onChange }
					className="editor-sharing__message-input" />
			);
		}
	},

	render: function() {
		return (
			<div className="editor-sharing__publicize-message">
				<h5 className="editor-sharing__message-heading">
					{ this.translate( 'Customize the message', { context: 'Post editor sharing message heading' } ) }
				</h5>
				<TrackInputChanges onNewValue={ this.recordStats }>
					{ this.renderTextarea() }
				</TrackInputChanges>
			</div>
		);
	}
} );
