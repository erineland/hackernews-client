import React from 'react';
import App from '../../../src/client/components/app';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

describe('App', () => {
    const render = customProps => {
        const props = {
            // Default props
            ...customProps,
        }
        return mount(<App {...props}/>);
    }

    it('renders the app as expected', done => {
        const component = renderer.create(
            <App />,
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
        done();
    });
});

