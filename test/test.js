const { expect } = require('chai');
const { MockRuntime } = require('@axway/api-builder-test-utils');
const getPlugin = require('../src');

describe('flow-node centralauth', () => {
	let plugin;
	let flowNode;
	beforeEach(async () => {
		plugin = await MockRuntime.loadPlugin(getPlugin);
		flowNode = plugin.getFlowNode('centralauth');
	});

	describe('#constructor', () => {
		it('should define flow-nodes', () => {
			expect(plugin).to.be.a('object');
			expect(plugin.getFlowNodeIds()).to.deep.equal([
				'centralauth'
			]);
			expect(flowNode).to.be.a('object');

			// Ensure the flow-node matches the spec
			expect(flowNode.name).to.equal('API Central Authentication');
			expect(flowNode.description).to.equal('Get an access token for API Central.');
			expect(flowNode.icon).to.be.a('string');
			expect(flowNode.getMethods()).to.deep.equal([
				'authenticateJWT'
			]);
		});

		// It is vital to ensure that the generated node flow-nodes are valid
		// for use in API Builder. Your unit tests should always include this
		// validation to avoid potential issues when API Builder loads your
		// node.
		it('should define valid flow-nodes', () => {
			// if this is invalid, it will throw and fail
			plugin.validate();
		});
	});

	describe('#authenticateJWT', () => {
		it('should error when missing required parameter', async () => {
			// Invoke #hello with a non-number and check error.
			const { value, output } = await flowNode.authenticateJWT({});

			expect(value).to.be.instanceOf(Error)
				.and.to.have.property('message', 'Missing required parameter: kid');
			expect(output).to.equal('error');
		});

	});
});
