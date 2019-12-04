import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import { Container, baseStyles } from 'unified-ui';

import CodeBlock from './CodeBlock';

const Style = ({children}) => (
    <style
        dangerouslySetInnerHTML={{
            __html: children
        }}
    />
);

const components = {
    h1: props => <h1 style={{color: 'tomato'}} {...props} />,
    pre: props => <div {...props} />,
    code: CodeBlock
};

const MDXLayout = props => (
    <MDXProvider components={components} className="mdx-provider">
        <>
            <Style>{baseStyles}</Style>
            <Container {...props} />
        </>
    </MDXProvider>
);

export default MDXLayout;
