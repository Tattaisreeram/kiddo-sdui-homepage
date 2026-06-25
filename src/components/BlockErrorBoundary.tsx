import React from 'react';
import type { Block } from '../types/sdui';

interface Props {
  readonly block: Block;
  readonly children: React.ReactNode;
}

interface State {
  readonly hasError: boolean;
}

export class BlockErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    if (__DEV__) {
      console.error(
        `[BlockErrorBoundary] Skipping block id=${this.props.block.id} type=${this.props.block.type}`,
        error,
      );
    }
  }

  render(): React.ReactNode {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
