import * as React from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { RingLoader } from 'react-spinners';

import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';

import ICredentials from 'src/store/ICredentials';
import IRootState from 'src/store/IRootState';

import Actions from 'src/store/Actions';
import { CredentialsActionType, ICredentialsAction } from 'src/store/ICredentialsAction';

import './Login.css';

interface IStateProps {
    credentials: ICredentials;
    loginError?: string;
    gettingToken: boolean;
}

interface IDispatchProps {
    updateCredentials: (newCredentials: ICredentials) => void;
    beginLogin: () => void;
}

type IProps = IStateProps & IDispatchProps & InjectedIntlProps

class Login extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props);
        this.updateUsername = this.updateUsername.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.tryLogin = this.tryLogin.bind(this);
    }

    public render(): React.ReactNode {
        if (this.props.gettingToken)
            return (
                <div className="Login-loading">
                    <RingLoader loading={true} color="#E3EFFC" size={500} />
                    <p className="Login-loading-text">
                        Logging In
                    </p>
                </div>
            );
        return (
            <div className="Login">
                <h1 className="Login-title"><FormattedMessage id="login.title" /></h1>
                <input type="text" name="username" autoComplete="on" className="form-control Login-username" onChange={this.updateUsername} value={this.props.credentials.username} placeholder={this.props.intl.formatMessage({
                    id: "login.username"
                })} />
                <input type="password" name="password" autoComplete="on" className="form-control Login-password" onChange={this.updatePassword} value={this.props.credentials.password} placeholder={this.props.intl.formatMessage({
                    id: "login.password"
                })} />
                <button onClick={this.tryLogin} className="Login-submit" disabled={!this.props.credentials.username || !this.props.credentials.password} >
                    <FormattedMessage id="login.submit" />
                </button>
                {this.renderLoginError()}
            </div>
        );
    }

    private renderLoginError(): React.ReactNode {
        if(!this.props.loginError)
            return null
        return (
            <p className="Login-error">
                {this.props.loginError}
            </p>
        )
    }

    private updateUsername(event: React.ChangeEvent<HTMLInputElement>) {
        const newUsername = event.target.value;
        this.props.updateCredentials({
            password: this.props.credentials.password,
            username: newUsername
        });
    }

    private updatePassword(event: React.ChangeEvent<HTMLInputElement>) {
        const newPassword = event.target.value;
        this.props.updateCredentials({
            password: newPassword,
            username: this.props.credentials.username
        });
    }

    private tryLogin(event: React.MouseEvent<HTMLButtonElement>) {
        this.props.beginLogin();
    }
}

const mapStateToProps = (state: IRootState, ownProps: any): IStateProps => ({
    credentials: state.credentials,
    gettingToken: state.refreshingToken,
    loginError: state.loginError
})

const mapDispatchToProps = (dispatch: Dispatch<Action>, ownProps: any): IDispatchProps => ({
    beginLogin: () => dispatch({
        type: Actions.BeginLogin
    }),
    updateCredentials: (newCredentials: ICredentials) => {
        const credentialsUpdateDispatch: ICredentialsAction = {
            action: Actions.CredentialsUpdate,
            credentials: newCredentials,
            type: CredentialsActionType
        };
        dispatch(credentialsUpdateDispatch);
    }
});

export default connect<IStateProps, IDispatchProps, {}>(mapStateToProps, mapDispatchToProps)(injectIntl(Login));