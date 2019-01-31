import * as appActions from './appActions';
import * as configActions from './configActions';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';

export const mdp = (dispatch) => (bindActionCreators({
  ...appActions,
  ...configActions
}, dispatch));

export const msp = (state, props) => state

export const Connect = connect(msp, mdp);