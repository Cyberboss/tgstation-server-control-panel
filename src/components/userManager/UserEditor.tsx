import * as React from 'react';

import { User } from '../../clients/generated';

import IUserClient from '../../clients/IUserClient';

interface IProps {
    userClient: IUserClient;
    user: User;
    own: boolean;

    updateAction(user: User): void;
    backAction(): void;
}

export default class UserEditor extends React.Component<IProps> {
    public render(): React.ReactNode {
        return <div />
    }
}
