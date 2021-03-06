import React from 'react';
import { connect } from 'react-redux';
import Settings from './Settings';
import { createSelector } from 'reselect';
import { selectDefaultPVService, selectDisplayLanguage } from './../userSelector';
import * as userActions from './../userActions';
import i18n from './../../../common/i18n';

Settings.navigationOptions = ({ navigation }) => {

    const { params } = navigation.state;

    return {
        title: params ? params.title : i18n.settings,
    }
}

const mapStateSelect = createSelector(
    selectDisplayLanguage(),
    selectDefaultPVService(),
    (displayLanguage, defaultPVService) => ({ settings: { displayLanguage, defaultPVService } })
);

const mapDispatchToProps = (dispatch, props) => ({
    onSettingsChanged: settings => dispatch(userActions.updateSettings(settings))
})

export default connect(mapStateSelect, mapDispatchToProps)(Settings)