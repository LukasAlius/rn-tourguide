import React from 'react';
import { View, Text, ScrollView, TextInput } from 'react-native';
import renderer from 'react-test-renderer';
import { copilot, walkthroughable, CopilotStep } from './index';
import CopilotModal from './components/CopilotModal';
import ViewMask from './components/ViewMask';
import SvgMask from './components/SvgMask';

const WalkthroughableView = walkthroughable(View);

const SampleComponent = () => (
  <View>
    <CopilotStep order={0} name="step-1" text="This is the description for the first step">
      <WalkthroughableView />
    </CopilotStep>
    <CopilotStep order={1} name="step-2" text="This is the description for the second step">
      <WalkthroughableView />
    </CopilotStep>
    <CopilotStep order={3} name="step-3" text="This is the description for the third step">
      <WalkthroughableView />
    </CopilotStep>
  </View>
);

it('only renders the component within a wrapper as long as tutorial has not been started', () => {
  const CopilotComponent = copilot()(SampleComponent);

  const tree = renderer.create(<CopilotComponent />);
  const numberOfChildren = tree.root.findByType(CopilotModal).children.length;

  expect(numberOfChildren).toEqual(0);
});

it('renders the modal once the tutorial is started', () => {
  const CopilotComponent = copilot()(SampleComponent);

  const tree = renderer.create(<CopilotComponent />);
  tree.root.findByType(SampleComponent).props.start();

  const numberOfChildren = tree.root.findByType(CopilotModal).children.length;

  expect(numberOfChildren).toBeGreaterThan(0);
});

it('renders <ViewMask /> when the overlay is `view`', () => {
  const CopilotComponent = copilot({
    overlay: 'view',
  })(SampleComponent);

  const tree = renderer.create(<CopilotComponent />);
  tree.root.findByType(SampleComponent).props.start();

  const maskComponent = tree.root.findByType(ViewMask);

  expect(maskComponent).toBeDefined();
});

it('renders <SvgMask /> when the overlay is `svg`', () => {
  const CopilotComponent = copilot({
    overlay: 'svg',
  })(SampleComponent);

  const tree = renderer.create(<CopilotComponent />);
  tree.root.findByType(SampleComponent).props.start();

  const maskComponent = tree.root.findByType(SvgMask);

  expect(maskComponent).toBeDefined();
});

it('updates the tooltip text when navigating through the steps', async () => {
  const CopilotComponent = copilot()(SampleComponent);

  const tree = renderer.create(<CopilotComponent />);
  tree.root.findByType(SampleComponent).props.start();

  const textComponent = tree.root.findByProps({
    testID: 'stepDescription',
  });

  expect(textComponent.props.children).toBe('This is the description for the first step');

  await tree.root.instance.next();

  expect(textComponent.props.children).toBe('This is the description for the second step');

  await tree.root.instance.next();

  expect(textComponent.props.children).toBe('This is the description for the third step');

  await tree.root.instance.prev();

  expect(textComponent.props.children).toBe('This is the description for the second step');
});

it('hides the tutorial tooltip once the tutorial is finished', async () => {
  const CopilotComponent = copilot()(SampleComponent);

  const tree = renderer.create(<CopilotComponent />);
  const modal = tree.root.findByType(CopilotModal);

  expect(modal.children.length).toBe(0);

  tree.root.findByType(SampleComponent).props.start();

  expect(modal.children.length).toBeGreaterThan(0);

  tree.root.instance.stop();

  expect(modal.children.length).toBe(0);
});
