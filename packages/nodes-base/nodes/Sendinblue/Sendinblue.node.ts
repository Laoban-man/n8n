import {
	IExecuteFunctions,
} from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import {
	OptionsWithUri,
} from 'request';

export class Sendinblue implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Sendinblue',
		name: 'sendinBlue',
		icon: 'file:sendinblue.png',
		group: ['transform'],
		version: 1,
		description: 'Consume Sendinblue',
		defaults: {
			name: 'Sendinblue',
			color: '#1A82e2',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'SendinblueApi',
				required: true,
			}
		],
		properties: [
			// Node properties which the user gets displayed and
			// can change on the node.
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Contact',
						value: 'contact',
					},
				],
				default: 'contact',
				required: true,
				description: 'Resource to consume',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: [
							'contact',
						],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a contact',
					},
				],
				default: 'create',
				description: 'The operation to perform.',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'create',
						],
						resource: [
							'contact',
						],
					},
				},
				default: '',
				description: 'Primary email for the contact',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		let responseData;
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		//Get credentials the user provided for this node
		const credentials = await this.getCredentials('SendinblueApi') as IDataObject;

		if (resource === 'contact') {
			if (operation === 'create') {
				// get email input
				const email = this.getNodeParameter('email', 0) as string;
				// get additional fields input
				//const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;
				const data: IDataObject = {
					email,
				};

				//Object.assign(data, additionalFields);

				//Make http request according to <https://sendgrid.com/docs/api-reference/>
				const options: OptionsWithUri = {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'api-key': credentials.apiKey,
					},
					method: 'POST',
					body: data
					,
					uri: 'https://api.sendinblue.com/v3/contacts',
					json: true,
				};

				responseData = await this.helpers.request(options);
			}
		}

		// Map data to n8n data
		return [this.helpers.returnJsonArray(responseData)];
	}
}
