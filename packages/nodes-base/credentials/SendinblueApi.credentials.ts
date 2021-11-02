import {
    ICredentialType,
    NodePropertyTypes,
} from 'n8n-workflow';

export class SendinblueApi implements ICredentialType {
    name = 'SendinblueApi';
    displayName = 'Sendinblue API';
    documentationUrl = 'Sendinblue';
    properties = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string' as NodePropertyTypes,
            default: '',
        },
    ];
}
